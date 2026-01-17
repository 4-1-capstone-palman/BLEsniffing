// write.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import styles from './writestyle';
import Layout, { iconNames, UserProfile, MenuItem } from '../admin/admin_layout';
import axios from 'axios';

interface NoticeEditScreenProps {
  user?: UserProfile;
}

const NoticeEditScreen: React.FC<NoticeEditScreenProps> = ({ user }) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

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

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setAttachedFiles([...attachedFiles, uri]);
      }
    } catch (err) {
      console.warn('파일 첨부 실패:', err);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = [...attachedFiles];
    updated.splice(index, 1);
    setAttachedFiles(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    const noticeData = {
      title,
      content,
      isImportant,
      date: formatDate(date),
      attachedFiles
    };

    try {
      const response = await axios.post('http://172.30.1.59:3000/api/notice', noticeData);
      Alert.alert("성공", "공지사항이 저장되었습니다.", [
        { text: "확인", onPress: () => router.push('/notice/list') }
      ]);
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
      Alert.alert("에러", "공지사항 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <Layout
      user={user}
      title="공지사항 작성"
      menuItems={menuItems}
      activeMenuId="home"
      onLogout={handleLogout}
    >
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>제목</Text></View>
          <View style={styles.inputContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, isImportant && styles.checkboxChecked]}
                onPress={() => setIsImportant(!isImportant)}
              >
                {isImportant && <MaterialIcons name="check" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>공지</Text>
            </View>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>내용</Text></View>
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="공지 내용을 입력하세요"
              value={content}
              onChangeText={setContent}
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>예약일자</Text></View>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateInput}>{formatDate(date)}</Text>
            </TouchableOpacity>
            <Text style={styles.dateHelpText}>* 게시 예정일 선택</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><Text style={styles.sectionLabel}>첨부파일</Text></View>
          <View style={styles.attachmentContainer}>
            <TouchableOpacity style={styles.fileDropZone} onPress={handleAttachFile}>
              <Text style={styles.fileAddText}>파일 선택</Text>
            </TouchableOpacity>

            {attachedFiles.length > 0 && (
              <View style={styles.attachedFilesList}>
                {attachedFiles.map((file, index) => (
                  <View key={index} style={styles.attachedFile}>
                    <Text numberOfLines={1} style={styles.fileName}>{file.split('/').pop()}</Text>
                    <TouchableOpacity
                      style={styles.removeFileButton}
                      onPress={() => handleRemoveFile(index)}
                    >
                      <Text style={{ color: 'white', fontSize: 12 }}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>확인</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </ScrollView>
    </Layout>
  );
};

export default NoticeEditScreen;
