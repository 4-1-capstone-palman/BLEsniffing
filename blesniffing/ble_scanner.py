import subprocess
import re
import json
import time
from bluepy.btle import Scanner
from collections import defaultdict
from database import save_ble_mac, save_router_mac
from black_screen import show_black_screen_gui, hide_black_screen_gui

# 설정값
RSSI_THRESHOLD = -35
SCAN_INTERVAL = 4.0
WHITELIST_PATH = "whitelist.json"
mac_detect_count = defaultdict(int)

# 상태 저장
ble_miss_count = 0  # BLE 연속 미감지 횟수
ble_ever_detected = False  # BLE가 한 번이라도 감지된 적 있는지 여부

# ✅ 화이트리스트 로드
def load_whitelist():
    try:
        with open(WHITELIST_PATH, "r") as f:
            return json.load(f)["mac_addresses"]
    except Exception as e:
        print(f"[❌ 화이트리스트 로드 실패] {e}")
        return []

# ✅ 공유기 연결 MAC 리스트
def get_connected_devices(interface="eth0", ip_range="192.168.0.0/24"):
    try:
        result = subprocess.check_output(["sudo", "arp-scan", "--interface", interface, ip_range]).decode()
        devices = []
        for line in result.splitlines():
            match = re.match(r"(\d+\.\d+\.\d+\.\d+)\s+([0-9A-Fa-f:]{17})", line)
            if match:
                ip, mac = match.groups()
                devices.append((ip, mac.upper()))
        return devices
    except Exception as e:
        print(f"[❌ arp-scan 실패] {e}")
        return []

# ✅ BLE 제조사 기반 스마트폰 구분
def get_device_type(scan_data):
    manuf_data = next((v for (adtype, desc, v) in scan_data if desc == 'Manufacturer'), '').lower()

    if not manuf_data:
        return None

    # iBeacon 제외
    if manuf_data.startswith("4c00") and "0215" in manuf_data:
        return None

    if manuf_data.startswith("4c00"):
        return "Apple"

    known_android_prefixes = ["7500", "0075", "e000", "00e0", "9900", "0100", "0600"]
    if any(manuf_data.startswith(prefix) for prefix in known_android_prefixes):
        return "Samsung"

    return None

# ✅ 메인 스캔 루프
def scan_and_check_zone():
    global ble_miss_count, ble_ever_detected
    scanner = Scanner()
    whitelist = load_whitelist()
    is_blocked = False
    authorized = False

    print("[🔍 BLE 스캔 시작 - Apple/Samsung 장치 탐지 + 공유기 접속 MAC 확인]")

    while True:
        devices = scanner.scan(SCAN_INTERVAL)
        phone_detected = False

        for dev in devices:
            mac = dev.addr.upper()
            rssi = dev.rssi
            scan_data = dev.getScanData()

            if rssi < RSSI_THRESHOLD:
                continue

            device_type = get_device_type(scan_data)
            if device_type is None:
                continue

            mac_detect_count[mac] += 1
            print(f"[📡 MAC: {mac} | RSSI: {rssi}dBm] : {device_type} 장치 | 누적: {mac_detect_count[mac]}")
            save_ble_mac(mac, rssi)
            phone_detected = True
            ble_ever_detected = True

        # BLE 감지 안 됨
        if not phone_detected:
            if not ble_ever_detected:
                print("[🟡 방에 스마트폰 없음]")
                time.sleep(1)
                continue

            ble_miss_count += 1
            print(f"[🟡 BLE 미감지 {ble_miss_count}회차]")

            if ble_miss_count >= 5:
                print("[❗BLE 5회 연속 미감지 → 스마트폰 없음 처리]")
                if is_blocked:
                    print("[🔓 차단 해제 - 스마트폰 사라짐]")
                    hide_black_screen_gui()
                authorized = False
                is_blocked = False
                ble_ever_detected = False  # 다시 초기 상태로
                ble_miss_count = 0
            time.sleep(1)
            continue
        else:
            ble_miss_count = 0  # BLE 탐지 시 초기화

        # BLE 감지되었고, 인가 확인 전이면 일단 차단
        if not is_blocked and not authorized:
            print("[📵 BLE 스마트폰 감지됨 → 일단 차단 실행]")
            show_black_screen_gui()
            is_blocked = True

        # Wi-Fi MAC 체크
        if not authorized:
            print("\n[🔎 공유기 접속 중인 장치들 확인 중]")
            connected_devices = get_connected_devices()
            connected_macs = []

            for ip, mac in connected_devices:
                print(f"🔗 IP: {ip} | MAC: {mac}")
                connected_macs.append(mac)
                save_router_mac(ip, mac, mac in whitelist)

            if any(mac in whitelist for mac in connected_macs):
                print("[✅ 인가자 확인됨 - 차단 해제]")
                if is_blocked:
                    hide_black_screen_gui()
                    is_blocked = False
                authorized = True
            else:
                print("[⛔ 비인가자 - 차단 유지 중]")

        else:
            print("[✔️ 인가자 상태 유지 중 - 차단 없음]")

        print("-" * 50)
        time.sleep(1)

# ✅ 직접 실행 시
if __name__ == "__main__":
    scan_and_check_zone()
