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
            style={[styles.documentName, { color: theme.colors.textPrimary, fontFamily: 'poppins-regular' }]}
          numberOfLines={1}
        >
          {document.name}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeDocumentButton}
        onPress={() => handleRemoveDocument(document.id)}
      >
        <MaterialCommunityIcons name="close" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
            Apply for Rental
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Property Card */}
          <Card style={styles.propertyCard}>
            <View style={styles.propertyCardContent}>
              <Image
                source={{ uri: property.images[0] }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
              <View style={styles.propertyInfo}>
                <Text
                  style={[styles.propertyTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' }]}
                  numberOfLines={2}
                >
                  {property.title}
                </Text>
                <Text
                  style={[styles.propertyLocation, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}
                  numberOfLines={1}
                >
                  {property.location}
                </Text>
                <Text
                  style={[styles.propertyPrice, { color: theme.colors.primary, fontFamily: 'poppins-semibold' }]}
                >
                  ${property.price}/mo
                </Text>
              </View>
            </View>
          </Card>

          <View style={styles.sectionTitle}>
            <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
              Application Form
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
              Please fill in your details to apply for this property
            </Text>
          </View>

          <Formik
            initialValues={{
              fullName: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              occupation: '',
              income: '',
              moveInDate: '',
              tenants: '1',
              additionalInfo: '',
            }}
            validationSchema={ApplicationSchema}
            onSubmit={handleSubmitApplication}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
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
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="phone-pad"
                  icon="phone-outline"
                />

                <Input
                  label="Occupation"
                  placeholder="Enter your occupation"
                  value={values.occupation}
                  onChangeText={handleChange('occupation')}
                  onBlur={handleBlur('occupation')}
                  error={errors.occupation}
                  touched={touched.occupation}
                  icon="briefcase-outline"
                />

                <Input
                  label="Monthly Income (USD)"
                  placeholder="Enter your monthly income"
                  value={values.income}
                  onChangeText={handleChange('income')}
                  onBlur={handleBlur('income')}
                  error={errors.income}
                  touched={touched.income}
                  keyboardType="numeric"
                  icon="cash-multiple"
                />

                <Input
                  label="Preferred Move-in Date"
                  placeholder="YYYY-MM-DD"
                  value={values.moveInDate}
                  onChangeText={handleChange('moveInDate')}
                  onBlur={handleBlur('moveInDate')}
                  error={errors.moveInDate}
                  touched={touched.moveInDate}
                  icon="calendar"
                />

                <Input
                  label="Number of Tenants"
                  placeholder="Enter number of tenants"
                  value={values.tenants}
                  onChangeText={handleChange('tenants')}
                  onBlur={handleBlur('tenants')}
                  error={errors.tenants}
                  touched={touched.tenants}
                  keyboardType="numeric"
                  icon="account-group"
                />

                <Input
                  label="Additional Information (Optional)"
                  placeholder="Enter any additional information you want to share"
                  value={values.additionalInfo}
                  onChangeText={handleChange('additionalInfo')}
                  onBlur={handleBlur('additionalInfo')}
                  error={errors.additionalInfo}
                  touched={touched.additionalInfo}
                  multiline
                  numberOfLines={4}
                  icon="information-outline"
                />

                <View style={styles.documentsSection}>
                  <Text style={[styles.documentsSectionTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
                    Upload Documents
                  </Text>
                  <Text style={[styles.documentsSectionSubtitle, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
                    Please upload your ID, proof of income, and any other relevant documents
                  </Text>

                  {documents.length > 0 && (
                    <View style={styles.documentsList}>
                      {documents.map(renderDocumentItem)}
                    </View>
                  )}

                  <Button
                    title={uploadingImage ? 'Uploading...' : 'Select Documents'}
                    onPress={handleSelectDocument}
                    variant="outlined"
                    size="medium"
                    disabled={uploadingImage}
                    icon={
                      uploadingImage ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                      ) : (
                        <MaterialCommunityIcons name="file-upload-outline" size={20} color={theme.colors.primary} />
                      )
                    }
                    style={{ marginTop: 12 }}
                  />
                </View>

                <View style={styles.termsContainer}>
                  <MaterialCommunityIcons
                    name="checkbox-marked"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.termsText,
                      { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                    ]}
                  >
                    By submitting this application, I confirm that all the information provided is true and accurate. I understand that providing false information may result in rejection of my application.
                  </Text>
                </View>

                <Button
                  title={submitting ? 'Submitting...' : 'Submit Application'}
                  onPress={handleSubmit}
                  variant="primary"
                  size="large"
                  fullWidth
                  loading={submitting}
                  disabled={submitting}
                  style={{ marginTop: 24 }}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  propertyCard: {
    marginBottom: 24,
  },
  propertyCardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 18,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 24,
  },
  documentsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  documentsSectionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  documentsSectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  documentsList: {
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  removeDocumentButton: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  termsText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default ApplyForRentalScreen;
