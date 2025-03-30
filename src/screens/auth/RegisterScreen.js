import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Validation schema for registration form
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be at least 10 digits'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { signUp } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get user type from route params or default to tenant
  const { userType = 'tenant' } = route.params || {};
  
  // Get color and icon based on user type
  const getUserTypeConfig = () => {
    switch (userType) {
      case 'tenant':
        return {
          color: theme.colors.tenant,
          icon: 'home-search',
          title: 'Create Tenant Account',
        };
      case 'landlord':
        return {
          color: theme.colors.landlord,
          icon: 'home-city',
          title: 'Create Landlord Account',
        };
      case 'buyer':
        return {
          color: theme.colors.buyer,
          icon: 'home-plus',
          title: 'Create Buyer Account',
        };
      case 'agent':
        return {
          color: theme.colors.agent,
          icon: 'briefcase',
          title: 'Create Agent Account',
        };
      default:
        return {
          color: theme.colors.tenant,
          icon: 'home-search',
          title: 'Create Tenant Account',
        };
    }
  };
  
  const userTypeConfig = getUserTypeConfig();

  // Handle registration form submission
  const handleRegister = async (values) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      // Add user type to values
      const userData = {
        ...values,
        role: userType,
      };
      
      const result = await signUp(userData);
      
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully! You can now login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration. Please try again.');
      console.log('Registration error:', error);
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: userTypeConfig.color },
              ]}
            >
              <MaterialCommunityIcons
                name={userTypeConfig.icon}
                size={32}
                color={theme.colors.white}
              />
            </View>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.textPrimary,
                  fontFamily: 'poppins-bold',
                },
              ]}
            >
              {userTypeConfig.title}
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
              Please fill in your details to register
            </Text>
          </View>

          {errorMessage ? (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: theme.colors.error + '20' }, // Adding transparency
              ]}
            >
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
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
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  error={errors.fullName}
                  touched={touched.fullName}
                  icon="account-outline"
                />

                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="email-outline"
                />

                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                  keyboardType="phone-pad"
                  icon="phone-outline"
                />

                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry
                  icon="lock-outline"
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  secureTextEntry
                  icon="lock-check-outline"
                />

                <View style={styles.termsContainer}>
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    size={24}
                    color={userTypeConfig.color}
                  />
                  <Text
                    style={[
                      styles.termsText,
                      {
                        color: theme.colors.textSecondary,
                        fontFamily: 'poppins-regular',
                      },
                    ]}
                  >
                    By registering, you agree to our{' '}
                    <Text
                      style={[
                        styles.termsLink,
                        {
                          color: userTypeConfig.color,
                          fontFamily: 'poppins-medium',
                        },
                      ]}
                    >
                      Terms & Conditions
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={[
                        styles.termsLink,
                        {
                          color: userTypeConfig.color,
                          fontFamily: 'poppins-medium',
                        },
                      ]}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </View>

                <Button
                  title="Create Account"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isSubmitting}
                  style={{ 
                    marginTop: 16,
                    backgroundColor: userTypeConfig.color
                  }}
                />
              </View>
            )}
          </Formik>

          <View style={styles.loginContainer}>
            <Text
              style={[
                styles.loginText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: 'poppins-regular',
                },
              ]}
            >
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  styles.loginLink,
                  {
                    color: userTypeConfig.color,
                    fontFamily: 'poppins-medium',
                  },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  termsText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  termsLink: {
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    marginRight: 4,
  },
  loginLink: {
    fontSize: 16,
  },
});

export default RegisterScreen;
