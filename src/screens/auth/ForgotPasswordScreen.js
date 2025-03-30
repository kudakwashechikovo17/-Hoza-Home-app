import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Validation schema for email
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Handle forgot password form submission
  const handleForgotPassword = async (values) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setResetSent(true);
      
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while sending the reset link. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Image
              source={require('../../../assets/images/forgot-password.png')}
              style={styles.image}
              resizeMode="contain"
            />
            
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: 'poppins-bold',
                },
              ]}
            >
              Forgot Password?
            </Text>
            
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: 'poppins-regular',
                },
              ]}
            >
              {resetSent
                ? 'We have sent a password reset link to your email address.'
                : 'Enter your email address and we will send you a link to reset your password.'}
            </Text>
          </View>

          {resetSent ? (
            <View style={styles.successContainer}>
              <MaterialCommunityIcons
                name="check-circle"
                size={64}
                color={theme.colors.success}
              />
              
              <Text
                style={[
                  styles.successText,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: 'poppins-medium',
                  },
                ]}
              >
                Check your email
              </Text>
              
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                variant="primary"
                size="large"
                fullWidth
                style={{ marginTop: 32 }}
              />
              
              <TouchableOpacity
                style={styles.resendContainer}
                onPress={() => setResetSent(false)}
              >
                <Text
                  style={[
                    styles.resendText,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: 'poppins-regular',
                    },
                  ]}
                >
                  Didn't receive an email?{' '}
                  <Text
                    style={[
                      styles.resendLink,
                      {
                        color: theme.colors.primary,
                        fontFamily: 'poppins-medium',
                      },
                    ]}
                  >
                    Try again
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleForgotPassword}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.formContainer}>
                  <Input
                    label="Email"
                    placeholder="Enter your email address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={errors.email}
                    touched={touched.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="email-outline"
                  />

                  <Button
                    title="Send Reset Link"
                    onPress={handleSubmit}
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={isSubmitting}
                    style={{ marginTop: 24 }}
                  />

                  <TouchableOpacity
                    style={styles.backToLoginContainer}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text
                      style={[
                        styles.backToLoginText,
                        {
                          color: theme.colors.textSecondary,
                          fontFamily: 'poppins-medium',
                        },
                      ]}
                    >
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  backToLoginContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  successText: {
    fontSize: 20,
    marginTop: 16,
  },
  resendContainer: {
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    textAlign: 'center',
  },
  resendLink: {
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
