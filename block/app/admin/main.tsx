import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Layout, { iconNames, UserProfile, MenuItem } from './admin_layout';
import { MaterialIcons } from '@expo/vector-icons';
import io from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const socket = io('http://172.30.1.29:3000');

interface MainPageProps {
  user?: UserProfile;
}

const MainPage: React.FC<MainPageProps> = ({ user }) => {
  const router = useRouter();
  const [deviceDetected, setDeviceDetected] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  const handleLogout = () => {
    router.replace('/login/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'home', iconName: iconNames.home, onPress: () => router.push('/admin/main') },
    { id: 'camera', iconName: iconNames.camera, onPress: () => router.push('/admin/admin') },
    { id: 'book', iconName: iconNames.book, onPress: () => router.push('/admin/info') },
  ];

  const goToNoticeList = () => {
    router.push('../notice/list');
  };

useEffect(() => {
  const testMessage = 'A구역에 기기가 감지되었습니다.';
  setDeviceDetected(true);
  setAlerts(prev => [testMessage, ...prev]);

  const setupSocketAndNotifications = async () => {
    socket.on('device-detected', async (message: string = 'A구역에서 감지됐습니다.') => {
      setDeviceDetected(true);
      setAlerts(prev => [message, ...prev]);

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus === 'granted') {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '기기 감지',
              body: message,
              sound: 'default',
            },
            trigger: null,
          });
        }
      }
    });
  };

  setupSocketAndNotifications();

  return () => {
    socket.off('device-detected');
  };
}, []);


  const mainContent = (
    <ScrollView>
      <View style={styles.row}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.addButton} onPress={goToNoticeList}>
            <MaterialIcons name="announcement" size={24} color="#000" />
            <Text style={styles.addButtonText}>공지사항</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardAlert}>
          <View style={styles.notificationContainer}>
            <View style={styles.alertHeader}>
              <MaterialIcons name="notifications" size={24} color="#000" />
              <Text style={styles.cardTitle}>알림</Text>
            </View>
            {alerts.map((alert, index) => (
              <View key={index} style={styles.alertBox}>
                <Text style={styles.alertText}>● {alert}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}></View>
      </View>
    </ScrollView>
  );

  return (
    <Layout
      user={user}
      title="메인화면"
      menuItems={menuItems}
      activeMenuId="home"
      onLogout={handleLogout}
    >
      {mainContent}
    </Layout>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAlert: {
    flex: 1,
    backgroundColor: '#F5FBFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    height: 200,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationContainer: {
    width: '100%',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertBox: {
    backgroundColor: '#5CC6FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    width: '100%',
  },
  alertText: {
    color: '#000',
    fontSize: 14,
  },
});

export default MainPage;
