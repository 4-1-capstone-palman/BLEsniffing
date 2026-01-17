# BLE 기반 실시간 감지 및 화면 차단 시스템

---

## 📖 프로젝트 개요 (Overview)
**BRDSB**는 기업 회의실, 군사 시설, 시험장 등 높은 보안이 요구되는 공간(Zone)에서 **비인가 모바일 기기(Non-authorized Mobile Devices)의 반입 및 사용을 실시간으로 탐지하고 차단**하는 보안 시스템입니다.

Bluetooth Low Energy(BLE) 기술을 활용하여 근거리의 전자기기를 즉각 감지하며, ARP 스캔을 통해 네트워크 인가 여부를 2차 검증합니다. 비인가 기기가 감지될 경우 모니터 화면을 강제로 차단(Lock)하여 중요 정보의 유출을 원천적으로 봉쇄합니다. 또한, 관리자의 모바일 애플리케이션을 통해 실시간 감지 알림을 수신하고 구역 내 기기 현황을 모니터링할 수 있습니다.

---

## 🚀 핵심 기능 (Key Features)

### 1. 📡 정밀 BLE 스니핑 (Precise BLE Sniffing)
- **근접 탐지 알고리즘**: RSSI(수신 신호 강도) 임계값(`-35dBm`)을 설정하여, 특정 구역 내에 아주 가깝게 접근한 기기만 선별적으로 탐지합니다.
- **제조사 필터링**: Advertising Packet의 Manufacturer Data를 정밀 분석하여 단순 비콘이 아닌 **실제 스마트폰(Apple, Samsung)**만을 타겟팅하여 오탐을 줄입니다. (iBeacon 등 제외)

### 2. 🔐 즉각적인 화면 차단 (Instant Screen Blocking)
- **Interrupt Blocking**: 스마트폰이 감지되는 즉시 `Tkinter` 기반의 **전체 화면(Fullscreen) 경고창**이 실행되어 PC 사용을 차단합니다.
- **시각적 경고**: "전자기기 탐지됨 접근 금지"라는 강력한 경고 메시지와 함께 카운트다운 타이머가 작동하여 사용자에게 압박을 줍니다.
- **관리자 알림**: 일정 시간(15초) 이상 차단이 유지될 경우 관리자 호출 모드로 전환됩니다.

### 3. � 관리자 모니터링 앱 (Manager App)
- **React Native 기반 앱**: 관리자는 모바일 앱을 통해 실시간으로 시스템 상황을 파악할 수 있습니다.
- **실시간 알림**: 기기 감지 시 소켓 통신(`socket.io`)을 통해 즉시 푸시 알림을 수신합니다 ("A구역에서 감지됐습니다.").
- **구역별 기기 현황**: '시스템 제어' 탭에서 각 구역(A구역, B구역 등)에 존재하는 기기 목록을 실시간으로 확인하고 관리할 수 있습니다.
    - 기기 정보 제공: 기기명, 종류(일반/임원 등), BLE MAC, 등록 상태 등.
- **제어 기능**: 필요 시 원격으로 특정 기기의 연결 상태를 제어하거나 모니터링할 수 있습니다.
- **공지사항**: 보안 관련 공지사항을 앱 내에서 확인하고 전파할 수 있습니다.

### 4. �🛡️ 이중 검증 시스템 (Dual-Verification)
단순히 BLE 신호만으로 차단하지 않고, 실제 인가된 기기인지 확인하는 2단계 프로세스를 거칩니다.
1. **1차 탐지**: BLE 신호가 포착되면 일단 **화면 차단**.
2. **2차 검증**: 로컬 네트워크(`arp-scan`)를 스캔하여 해당 기기의 MAC 주소가 `whitelist.json`에 있는지 확인.
3. **분기 처리**:
    - **인가된 기기(Whitelisted)**: 화면 차단 즉시 해제 및 정상 사용 허용.
    - **비인가 기기(Unauthorized)**: 화면 차단 유지 및 로그 기록.

### 5. 💾 데이터베이스 로깅 (DB Logging)
- **MySQL 연동**: 모든 탐지 이벤트와 네트워크 연결 기록을 MySQL 데이터베이스`palman`에 영구 저장합니다.
- **로그 데이터**:
    - `ble_logs`: 감지된 BLE MAC 주소, RSSI 강도, 타임스탬프.
    - `router_connections`: 공유기에 접속된 IP, MAC, 인가 여부.

---

## 🛠 시스템 아키텍처 및 기술 스택

### Detector (탐지기)
| 분류 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Language** | Python 3.8+ | 메인 로직 및 제어 |
| **Sensing** | `bluepy` | Linux/macOS BLE 인터페이스 라이브러리 |
| **Network** | `arp-scan` | 로컬 네트워크 연결 기기 MAC 스캔 |
| **GUI** | `tkinter` | 전체 화면 차단 및 경고 UI 구현 |
| **Server** | FastAPI | 웹 대시보드 및 API 확장용 |
| **Database** | MySQL (pymysql) | 탐지 로그 및 보안 감사 데이터 저장 |

### Manager App (관리자 앱)
| 분류 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Framework** | React Native (Expo) | 크로스 플랫폼 모바일 앱 개발 |
| **Network** | Axios / Socket.io-client | 서버 통신 및 실시간 알림 수신 |
| **Language** | TypeScript | 정적 타입 지원으로 안정성 확보 |
| **UI** | Expo Router / Vector Icons | 네비게이션 및 UI 컴포넌트 |

---

## 📂 프로젝트 구조 (Project Structure)

### 📡 탐지기 (BLEsniffing)
```bash
BLEsniffing/
├── ble_scanner.py      # [Core] BLE 스캔, 로직 판단, DB 저장 호출 메인 스크립트
├── black_screen.py     # [UI] 차단 화면(GUI) 생성 및 제어 모듈
├── database.py         # [DB] MySQL 연결 설정 및 INSERT 쿼리 관리
├── whitelist.json      # [Config] 인가된 기기 MAC 주소 관리 파일
├── main.py             # [Server] FastAPI 서버 진입점 (확장용)
└── requirements.txt    # [Pkg] 파이썬 의존성 패키지 목록
```

### 📱 관리자 앱 (Manager)
```bash
Manager/block/
├── app/
│   ├── admin/          # [Admin] 관리자용 메인 기능 (시스템 제어, 정보 등)
│   │   ├── admin.tsx       # 구역별 기기 리스트 및 제어 화면
│   │   ├── main.tsx        # 관리자 대시보드 및 알림 센터
│   │   └── info.tsx        # 기업 정보 화면
│   ├── login/          # [Auth] 로그인 관련 화면
│   └── notice/         # [Notice] 공지사항 관련 화면
├── assets/             # 이미지 및 아이콘 자원
└── components/         # 재사용 가능한 UI 컴포넌트
```

---

## 💿 설치 및 실행 가이드 (Installation & Usage)

### 1. 환경 설정 (Prerequisites)
**탐지기 (Detector):**
*   **Linux** 또는 **macOS** (Root 권한 필요)
*   Python 3.8 이상, `bluepy`, `arp-scan`
```bash
sudo apt-get update
sudo apt-get install python3-pip arp-scan libglib2.0-dev
```

**관리자 앱 (Manager App):**
*   Node.js & npm 설치 필요
*   Expo CLI 설치 권장

### 2. 데이터베이스 설정 (MySQL)
MySQL에 접속하여 데이터베이스와 테이블을 생성해야 합니다. (`database.py` 설정 기준)

```sql
CREATE DATABASE palman;
USE palman;

-- BLE 로그 테이블
CREATE TABLE ble_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mac_address VARCHAR(20),
    rssi INT,
    timestamp VARCHAR(30)
);

-- 네트워크 접속 로그 테이블
CREATE TABLE router_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(20),
    mac_address VARCHAR(20),
    is_whitelisted BOOLEAN,
    timestamp VARCHAR(30)
);
```

### 3. 프로젝트 설치
```bash
# 레포지토리 클론
git clone https://github.com/your-repo/BRDSB.git

# [탐지기]
cd BRDSB/BLEsniffing
pip install -r requirements.txt

# [관리자 앱]
cd ../Manager/block
npm install
```

### 4. 실행 방법

**탐지기 실행:**
```bash
# BRDSB/BLEsniffing 디렉토리에서
sudo python3 ble_scanner.py
```

**관리자 앱 실행:**
```bash
# BRDSB/Manager/block 디렉토리에서
npx expo start
```
*   Expo Go 앱을 통해 모바일 기기에서 스캔하거나 에뮬레이터로 실행합니다.

---

## ⚠️ 문제 해결 (Troubleshooting)

*   **BLE 권한 오류**: `bluepy`는 하드웨어 접근 권한이 필요합니다. 반드시 `sudo`를 사용하거나 사용자를 `bluetooth` 그룹에 추가하세요.
*   **소켓 연결 실패**: 관리자 앱(`main.tsx`) 내의 Socket.IO 서버 주소(`http://172.30.1.29:3000`)가 현재 실행 중인 서버 IP와 일치하는지 확인하세요.
*   **오탐지/미탐지**: 기기와의 거리에 따라 RSSI 값을 조정해야 할 수 있습니다. `ble_scanner.py`의 `RSSI_THRESHOLD` 값을 환경에 맞게 수정하세요.
