import { View, Image, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
    return (
        <LinearGradient
            colors={['#E30512', '#b91c1c', '#991b1b']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>समाजवादी टेक फ़ोर्स</Text>
                <Text style={styles.subtitle}>Admin Panel</Text>
                <View style={styles.versionContainer}>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    versionContainer: {
        position: 'absolute',
        bottom: -200,
        alignItems: 'center',
    },
    version: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
});
