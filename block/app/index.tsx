import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const StartScreen: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('login/login');
    }, 3000);

    return () => clearTimeout(timer);
}, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.Image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    Image: {
        width: Dimensions.get('window').width * 1,
        height: Dimensions.get('window').height * 0.8,
        resizeMode: 'contain',
    },
});

export default StartScreen;