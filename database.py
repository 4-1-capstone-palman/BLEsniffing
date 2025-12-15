import pymysql
from pymysql.constants import CLIENT
from datetime import datetime

def get_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='1234',   # ← 비밀번호 수정
        database='palman',
        client_flag=CLIENT.MULTI_STATEMENTS,
        charset='utf8mb4',
        use_unicode=True,
        cursorclass=pymysql.cursors.DictCursor
    )

# ✅ BLE MAC 저장 함수 - 사람이 읽을 수 있는 datetime으로 저장
def save_ble_mac(mac: str, rssi: int):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO ble_logs (mac_address, rssi, timestamp)
            VALUES (%s, %s, %s)
            """
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            cursor.execute(sql, (mac, rssi, now))
            conn.commit()
            print(f"[✅ BLE 저장] {mac}")
    except Exception as e:
        print(f"[❌ BLE 저장 실패] {e}")
    finally:
        if conn:
            conn.close()

# ✅ 공유기 MAC 저장 함수 (변경 없음)
def save_router_mac(ip: str, mac: str, is_whitelisted: bool):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            sql = """
            INSERT INTO router_connections (ip_address, mac_address, is_whitelisted, timestamp)
            VALUES (%s, %s, %s, %s)
            """
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            cursor.execute(sql, (ip, mac, is_whitelisted, now))
            conn.commit()
            print(f"[✅ 공유기 MAC 저장] {mac}")
    except Exception as e:
        print(f"[❌ 공유기 MAC 저장 실패] {e}")
    finally:
        if conn:
            conn.close()
