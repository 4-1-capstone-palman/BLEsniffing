import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import loginStyles from './login_2style';
import { ThemedText } from '@/components/ThemedText';
import { useUserStore } from '@/stores/userStore';

export default function LoginStep2Screen() {
  const [employeeId, setEmployeeId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { companyName } = useLocalSearchParams();

  const { setUser } = useUserStore();

  const handleLogin = async () => {
    if (!employeeId) {
      Alert.alert('입력 필요', '사원번호를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/login/step2', {
        employeeId
      });

      const employeeName = res.data.employeeName;

      setUser(employeeName, employeeId);

      Alert.alert('로그인 성공', `${employeeName}님 환영합니다!`);

      router.push({
        pathname: '/admin/main',
        params: {
          employeeName: res.data.employeeName,
          employeeId: employeeId
        }
      });
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        Alert.alert('로그인 실패', '사원번호가 잘못입력되었습니다.');
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

          <ThemedText style={loginStyles.title}>사원 인증</ThemedText>

          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="사원번호"
              value={employeeId}
              onChangeText={setEmployeeId}
              secureTextEntry={!showPassword}
              keyboardType="numeric"
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