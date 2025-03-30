import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ActivityIndicator, View } from 'react-native';
import * as Font from 'expo-font';

// Import themes and contexts
import theme from './src/theme';
import { AuthProvider } from './src/contexts/AuthContext';

// Import navigation
import AppNavigator from './src/navigation';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // Load fonts and other resources
  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync({
          'poppins-regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf'),
          'poppins-medium': require('./assets/fonts/Poppins-Medium.ttf'),
          'poppins-semibold': require('./assets/fonts/Poppins-SemiBold.ttf'),
          'poppins-light': require('./assets/fonts/Poppins-Light.ttf'),
        });
      } catch (e) {
        console.warn('Error loading assets:', e);
      } finally {
        setIsReady(true);
      }
    }

    loadResources();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B8E7D" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
