import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PropertyService from '../../services/propertyService';

// Validation schema for rental application
const ApplicationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .min(10, 'Phone number is too short'),
  occupation: Yup.string()
    .required('Occupation is required'),
  income: Yup.number()
    .required('Monthly income is required')
    .min(100, 'Monthly income must be at least $100'),
  moveInDate: Yup.string()
    .required('Preferred move-in date is required'),
  tenants: Yup.number()
    .required('Number of tenants is required')
    .min(1, 'Number of tenants must be at least 1'),
  additionalInfo: Yup.string(),
});

const ApplyForRentalScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { property } = route.params;
  
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Handle document selection
  const handleSelectDocument = async () => {
    try {
      setUploadingImage(true);
      
      // Request permission to access the media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your media library in order to upload documents.');
        return;
      }
      
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Add selected documents to state
        const newDocuments = result.assets.map((asset) => ({
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          uri: asset.uri,
          name: asset.fileName || `Document_${documents.length + 1}`,
          type: asset.mimeType || 'application/octet-stream',
        }));
        
        setDocuments([...documents, ...newDocuments]);
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      Alert.alert('Error', 'An error occurred while selecting documents. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle remove document
  const handleRemoveDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };
  
  // Handle application submission
  const handleSubmitApplication = async (values) => {
    try {
      setSubmitting(true);
      
      // Prepare application data
      const applicationData = {
        ...values,
        propertyId: property.id,
        tenantId: user.id,
        landlordId: property.landlordId,
        documents,
        appliedAt: new Date().toISOString(),
      };
      
      // Submit application
      const result = await PropertyService.applyForRental(user.id, property.id, applicationData);
      
      if (result.success) {
        Alert.alert(
          'Application Submitted',
          'Your rental application has been submitted successfully. The landlord will review your application and get back to you shortly.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('TenantDashboard'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to submit your application. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'An error occurred while submitting your application. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Render document item
  const renderDocumentItem = (document) => (
    <View key={document.id} style={[styles.documentItem, { borderColor: theme.colors.border }]}>
      <View style={styles.documentInfo}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color={theme.colors.primary}
        />
        <Text
          style={[styles.documentName, { color: theme.colors.textPrimary, fontFamily: 'poppins-regular' }]}
          numberOfLines={
