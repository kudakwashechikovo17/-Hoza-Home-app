import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import Button from '../../components/common/Button';

const WelcomeScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/images/hoza-logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Revolutionizing Real Estate in Zimbabwe
        </Text>
      </View>
      
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../../../assets/images/welcome-illustration.png')} 
          style={styles.illustration} 
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Find Your Dream Home
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Discover a seamless way to rent, buy, and manage properties all in one place.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('UserType')} 
          variant="primary"
          size="large"
          fullWidth
          style={{ marginBottom: 16 }}
        />
        <Button 
          title="I already have an account" 
          onPress={() => navigation.navigate('Login')} 
          variant="outlined"
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 50,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: '100%',
    height: '100%',
    maxHeight: 300,
  },
  contentContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'poppins-bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'poppins-regular',
  },
  buttonContainer: {
    marginBottom: 24,
  },
});

export default WelcomeScreen;
