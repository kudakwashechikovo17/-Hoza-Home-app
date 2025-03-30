import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Validation schema for login form
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const { signIn } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle login form submission
  const handleLogin = async (values) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      const result = await signIn(values.email, values.password);
      
      if (!result.success) {
        setErrorMessage(result.message || 'Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
      console.log('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample emails for demo accounts
  const demoAccounts = [
    { role: 'tenant', email: 'tenant@example.com' },
    { role: 'landlord', email: 'landlord@example.com' },
    { role: 'buyer', email: 'buyer@example.com' },
    { role: 'agent', email: 'agent@example.com' },
    { role: 'admin', email: 'admin@example.com' },
  ];

  // Demo login helper
  const handleDemoLogin = (email) => {
    Alert.alert(
      'Demo Account',
      `You are logging in with ${email}\nPassword is: password`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => handleLogin({ email, password: 'password' }),
        },
      ]
    );
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

          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/hoza-logo.png')}
              style={styles.logo}
              resizeMode="contain"
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
            Welcome Back!
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
            Please log in to your account
          </Text>

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
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
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
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry
                  icon="lock-outline"
                />

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text
                    style={[
                      styles.forgotPasswordText,
                      {
                        color: theme.colors.primary,
                        fontFamily: 'poppins-medium',
                      },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Log In"
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={isSubmitting}
                  style={{ marginTop: 16 }}
                />
              </View>
            )}
          </Formik>

          <View style={styles.registerContainer}>
            <Text
              style={[
                styles.registerText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: 'poppins-regular',
                },
              ]}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('UserType')}>
              <Text
                style={[
                  styles.registerLink,
                  {
                    color: theme.colors.primary,
                    fontFamily: 'poppins-medium',
                  },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Accounts Section */}
          <View style={styles.demoSection}>
            <Text
              style={[
                styles.demoTitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: 'poppins-medium',
                },
              ]}
            >
              Demo Accounts
            </Text>
            <View style={styles.demoButtons}>
              {demoAccounts.map((account) => (
                <TouchableOpacity
                  key={account.role}
                  style={[
                    styles.demoButton,
                    {
                      backgroundColor: theme.colors[account.role],
                      ...theme.shadows.light,
                    },
                  ]}
                  onPress={() => handleDemoLogin(account.email)}
                >
                  <Text
                    style={[
                      styles.demoButtonText,
                      {
                        color: theme.colors.white,
                        fontFamily: 'poppins-medium',
                      },
                    ]}
                  >
                    {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 150,
    height: 50,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  registerText: {
    fontSize: 16,
    marginRight: 4,
  },
  registerLink: {
    fontSize: 16,
  },
  demoSection: {
    marginTop: 8,
  },
  demoTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  demoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 4,
  },
  demoButtonText: {
    fontSize: 12,
  },
});

export default LoginScreen;
