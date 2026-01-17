import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserStore } from '@/stores/userStore';

export interface UserProfile {
  name: string;
  employeeId: string;
  avatarUri?: string;
}

export interface MenuItem {
  id: string;
  iconName: string;
  onPress?: () => void;
}

interface LayoutProps {
  user?: UserProfile;
  children: React.ReactNode;
  title: string;
  menuItems: MenuItem[];
  activeMenuId?: string;
  onLogout?: () => void;
}

const defaultUser: UserProfile = {
  name: '홍길동님',
  employeeId: '0000-0000-0000',
  avatarUri: 'https://via.placeholder.com/40'
};

export const Layout: React.FC<LayoutProps> = ({
  user,
  children,
  title,
  menuItems,
  activeMenuId,
  onLogout
}) => {
  const { name, employeeId } = useUserStore();

  const userData = {
    name: name || '홍길동님',
    employeeId: employeeId || '0000-0000-0000',
    avatarUri: 'https://via.placeholder.com/40'
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f0f3fa" barStyle="dark-content" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>통합관리 시스템</Text>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: userData.avatarUri || "https://via.placeholder.com/40" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfoContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileId}>사원번호: {userData.employeeId}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onLogout}
          >
            <Text style={styles.loginButtonText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="settings" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sidebar}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>{title}</Text>
          </View>

          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                activeMenuId === item.id && styles.activeMenuItem
              ]}
              onPress={item.onPress}
            >
              <Icon
                name={item.iconName}
                size={24}
                color={activeMenuId === item.id ? '#ffffff' : '#b8d9ef'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mainArea}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};

export const iconNames = {
  home: 'home',
  camera: 'photo-camera',
  book: 'book',
  notification: 'notifications',
  add: 'add',
  settings: 'settings',
  person: 'person',
  business: 'business',
  idCard: 'credit-card'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f3fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'column',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileId: {
    fontSize: 12,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#6d8ad7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  settingsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 60,
    backgroundColor: '#4b91cd',
  },
  menuHeader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5099d5',
    padding: 5,
  },
  menuHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  menuItem: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#5ba8e4',
  },
  activeMenuItem: {
    backgroundColor: '#5099d5',
  },
  mainArea: {
    flex: 1,
    padding: 16,
  },
});

export default Layout;
