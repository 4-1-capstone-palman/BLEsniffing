import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import loginStyles from './loginstyle';
import { ThemedText } from '@/components/ThemedText';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!userId || !password) {
      Alert.alert('입력 필요', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/login/step1', {
        userId: userId.trim(),
        password: password.trim()
      });

      const companyName = res.data.companyName;
      Alert.alert('로그인 성공', `${companyName} 기업 로그인 완료`);

      router.push({
        pathname: '/login_2/login_2',
        params: { companyName }
      });

    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못입력되었습니다.');
      } else{
      Alert.alert('로그인 실패', err.response?.data?.message || '서버 오류');
      }
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={loginStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={loginStyles.loginCard}>
          <View style={loginStyles.profileIconContainer}>
            <View style={loginStyles.profileIcon}>
              <FontAwesome name="user" size={40} color="white" />
            </View>
          </View>

          <ThemedText style={loginStyles.title}>기업 로그인</ThemedText>

          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="User ID"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />
            <FontAwesome name="user" size={18} color="#888" style={loginStyles.inputIcon} />
          </View>

          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={loginStyles.inputIcon}>
              <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
            <ThemedText style={loginStyles.loginButtonText}>로그인</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
