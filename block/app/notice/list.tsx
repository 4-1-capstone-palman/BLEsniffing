// list.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Layout, { iconNames, UserProfile, MenuItem } from '../admin/admin_layout';
import styles from './liststyle';
import axios from 'axios';

interface NoticeItem {
  _id: string;
  number: number;
  title: string;
  isImportant: boolean;
  author: string;
  date: string;
  views: number;
  isNew?: boolean;
}

interface NoticeListScreenProps {
  user?: UserProfile;
}

const NoticeListScreen: React.FC<NoticeListScreenProps> = ({ user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [noticeData, setNoticeData] = useState<NoticeItem[]>([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/notice');
      const filtered = res.data.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      const sorted = filtered.sort((a: any, b: any) => {
        if (a.isImportant === b.isImportant) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.isImportant ? -1 : 1;
      });
      const formatted = sorted.map((item: any, index: number) => ({
        ...item,
        number: index + 1,
        author: item.author || '관리자',
        isNew: index < 3
      }));
      setNoticeData(formatted);
    } catch (err) {
      console.error('공지사항 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    router.replace('/login/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'home', iconName: iconNames.home, onPress: () => router.push('/admin/main') },
    { id: 'camera', iconName: iconNames.camera, onPress: () => router.push('/admin/admin') },
    { id: 'book', iconName: iconNames.book, onPress: () => router.push('/admin/info') }
  ];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const showDateInput = (date: Date, setter: (d: Date) => void) => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = date.toISOString().substring(0, 10);
      input.style.position = 'absolute';
      input.style.left = '-1000px';
      input.addEventListener('change', (e: any) => {
        const selected = new Date(e.target.value);
        setter(selected);
        document.body.removeChild(input);
      });
      document.body.appendChild(input);
      input.click();
    }
  };

  const renderItem = ({ item }: { item: NoticeItem }) => (
    <TouchableOpacity style={styles.row} onPress={() => router.push(`/notice/noticedetail?id=${item._id}`)}>
      <Text style={styles.cell}>{item.number}</Text>
      <View style={[styles.cell, styles.titleCell]}>
        {item.isImportant && <Text style={styles.badgeImportant}>중요</Text>}
        <Text style={styles.titleText}>{item.title}</Text>
        {item.isNew && <Text style={styles.badgeNew}>N</Text>}
      </View>
      <Text style={styles.cell}>{item.author}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.views}</Text>
    </TouchableOpacity>
  );

  return (
    <Layout user={user} title="공지사항" menuItems={menuItems} activeMenuId="home" onLogout={handleLogout}>
      <View style={styles.container}>
        <View style={styles.filterRow}>
          <TouchableOpacity onPress={() => showDateInput(startDate, setStartDate)} style={styles.dateBox}>
            <Text>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          <Text style={styles.dateSeparator}>~</Text>
          <TouchableOpacity onPress={() => showDateInput(endDate, setEndDate)} style={styles.dateBox}>
            <Text>{formatDate(endDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchNotices} style={styles.searchButton}>
            <MaterialIcons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
  
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>번호</Text>
          <Text style={[styles.headerCell, styles.titleHeader]}>제목</Text>
          <Text style={styles.headerCell}>작성자</Text>
          <Text style={styles.headerCell}>작성일자</Text>
          <Text style={styles.headerCell}>조회수</Text>
        </View>
  
        {loading ? (
          <ActivityIndicator size="large" color="#2979FF" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={noticeData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text style={styles.emptyText}>공지사항이 없습니다.</Text>}
          />
        )}
  
        <TouchableOpacity
          style={styles.addNoticeButton}
          onPress={() => router.push('/notice/write')}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

export default NoticeListScreen;