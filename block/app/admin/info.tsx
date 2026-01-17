import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Layout, { iconNames, UserProfile, MenuItem } from './admin_layout';

interface CompanyInfoPageProps {
  user?: UserProfile;
}

const CompanyInfoPage: React.FC<CompanyInfoPageProps> = ({ user }) => {
  const router = useRouter();
  
  const handleLogout = () => {
    router.replace('/login/login');
  };
  
  const menuItems: MenuItem[] = [
    { id: 'home', iconName: iconNames.home, onPress: () => router.push('/admin/main') },
    { id: 'camera', iconName: iconNames.camera, onPress: () => router.push('/admin/admin') },
    { id: 'book', iconName: iconNames.book, onPress: () => router.push('/admin/info') },
  ];

  const mainContent = null;

  return (
    <Layout 
      user={user}
      title="기업정보" 
      menuItems={menuItems} 
      activeMenuId="book"
      onLogout={handleLogout}
    >
      {mainContent}
    </Layout>
  );
};

const styles = StyleSheet.create({});

export default CompanyInfoPage;