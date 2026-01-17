// noticedetail.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Layout, { iconNames, UserProfile, MenuItem } from '../admin/admin_layout';
import styles from './noticedetailstyle';

interface NoticeDetail {
  title: string;
  content: string;
  date: string;
  author: string;
  views: number;
}

interface NoticeDetailScreenProps {
  user?: UserProfile;
}

const NoticeDetailScreen: React.FC<NoticeDetailScreenProps> = ({ user }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id?.toString();

  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      incrementViews();
      fetchNotice(id);
    }
  }, [id]);

  const incrementViews = async () => {
    try {
      await axios.patch(`http://172.30.1.59:3000/api/notice/${id}/views`);
    } catch (err) {
      console.warn('조회수 증가 실패:', err);
    }
  };

  const fetchNotice = async (noticeId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/notice/${noticeId}`);
      setNotice(res.data);
    } catch (error) {
      console.error('공지사항 상세 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('공지 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://localhost:3000/api/notice/${id}`);
            Alert.alert('삭제 완료', '공지사항이 삭제되었습니다.');
            router.replace('/notice/list');
          } catch (err) {
            Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
          }
        }
      }
    ]);
  };

  const handleEdit = () => {
    router.push(`/notice/write?edit=true&id=${id}`);
  };

  const handleLogout = () => {
    router.replace('/login/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'home', iconName: iconNames.home, onPress: () => router.push('/admin/main') },
    { id: 'camera', iconName: iconNames.camera, onPress: () => router.push('/admin/admin') },
    { id: 'book', iconName: iconNames.book, onPress: () => router.push('/admin/info') },
  ];

  if (loading) {
    return (
      <Layout user={user} title="공지사항 상세" menuItems={menuItems} activeMenuId="home" onLogout={handleLogout}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2979FF" />
        </View>
      </Layout>
    );
  }

  if (!notice) {
    return (
      <Layout user={user} title="공지사항 상세" menuItems={menuItems} activeMenuId="home" onLogout={handleLogout}>
        <View style={styles.emptyContainer}>
          <Text>공지사항을 찾을 수 없습니다.</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout user={user} title="공지사항 상세" menuItems={menuItems} activeMenuId="home" onLogout={handleLogout}>
      <View style={styles.container}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.meta}>
          작성자: {notice.author} | 작성일: {notice.date} | 조회수: {notice.views}
        </Text>
        <Text style={styles.content}>{notice.content}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default NoticeDetailScreen;
