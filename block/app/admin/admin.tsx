// admin.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Layout, { iconNames, UserProfile, MenuItem } from './admin_layout';

interface DeviceInfo {
  id: string;
  ble_mac: string;
  captive_mac: string;
  device_name: string;
  status: '등록 안함' | '등록 중';
  device_type: string;
  connectionStatus: '연결' | '연결 중';
  area: string;
}

interface SystemControlPageProps {
  user?: UserProfile;
}

const SystemControlPage: React.FC<SystemControlPageProps> = ({ user }) => {
  const router = useRouter();
  const [deviceList, setDeviceList] = useState<DeviceInfo[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('A구역');

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin');
        setDeviceList(res.data);
      } catch (error) {
        console.error('기기 정보를 불러오지 못했습니다:', error);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleConnection = async (deviceId: string, currentStatus: string) => {
    const newStatus = currentStatus === '연결' ? '연결 중' : '연결';
    try {
      await axios.patch(`http://localhost:3000/api/admin/${deviceId}/toggle`, { status: newStatus });
      setDeviceList((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, connectionStatus: newStatus } : device
        )
      );
    } catch (err) {
      Alert.alert('오류', '상태 변경에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    router.replace('/login/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'home', iconName: iconNames.home, onPress: () => router.push('/admin/main') },
    { id: 'camera', iconName: iconNames.camera, onPress: () => router.push('/admin/admin') },
    { id: 'book', iconName: iconNames.book, onPress: () => router.push('/admin/info') },
  ];

  const filteredDevices = deviceList.filter((device) => device.area === selectedArea);

  const AreaTabs = () => (
    <View style={styles.tabContainer}>
      {['A구역', 'B구역'].map((area) => (
        <TouchableOpacity
          key={area}
          style={[styles.tab, selectedArea === area && styles.activeTab]}
          onPress={() => setSelectedArea(area)}
        >
          <Text style={[styles.tabText, selectedArea === area && styles.activeTabText]}>{area}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const TableHeader: React.FC = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerCell}>번호</Text>
      <Text style={styles.headerCell}>기기 이름</Text>
      <Text style={styles.headerCell}>기기 종류</Text>
      <Text style={styles.headerCell}>BLE(MAC)</Text>
      <Text style={styles.headerCell}>Captive(MAC)</Text>
      <Text style={styles.headerCell}>등록 상태</Text>
      <Text style={styles.headerCell}>연결 상태</Text>
    </View>
  );

  const renderTableRow = ({ item }: { item: DeviceInfo }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.device_name}</Text>
      <Text style={styles.cell}>
        {item.device_type === 'iphone' ? '일반' : item.device_type === '귀빈' ? '임원' : item.device_type}
      </Text>
      <Text style={styles.cell}>{item.ble_mac}</Text>
      <Text style={styles.cell}>{item.captive_mac}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <View style={[styles.cell, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => handleToggleConnection(item.id, item.connectionStatus)}>
          <Text style={{
            color: item.connectionStatus === '연결' ? '#9b111e' : '#4b91cd',
            fontWeight: 'bold',
            }}
          >
            {item.connectionStatus === '연결' ? '연결 해제' : '연결 중'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const mainContent = (
    <View style={{ flex: 1 }}>
      <AreaTabs />
      <View style={styles.tableContainer}>
        <TableHeader />
        <FlatList
          data={filteredDevices}
          renderItem={renderTableRow}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
        />
        <View style={styles.tablePagination}>
          <Text style={styles.paginationText}>총 {filteredDevices.length}건</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Layout
      user={user}
      title="시스템 제어"
      menuItems={menuItems}
      activeMenuId="camera"
      onLogout={handleLogout}
    >
      {mainContent}
    </Layout>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#4b91cd',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#6ab5e7',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0a509e',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  tablePagination: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  paginationText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SystemControlPage;
