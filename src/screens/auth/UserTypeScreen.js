import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/common/Button';

const UserTypeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState(null);

  const userTypes = [
    {
      id: 'tenant',
      title: 'I want to rent a home',
      description: 'Browse rental properties, apply for leases, and manage your tenancy.',
      icon: 'home-search',
      color: theme.colors.tenant,
    },
    {
      id: 'buyer',
      title: 'I want to buy a property',
      description: 'Search for homes or land for sale and connect with agents.',
      icon: 'home-plus',
      color: theme.colors.buyer,
    },
    {
      id: 'landlord',
      title: 'I want to rent out my property',
      description: 'List your properties, screen tenants, and manage rentals.',
      icon: 'home-city',
      color: theme.colors.landlord,
    },
    {
      id: 'agent',
      title: 'I am a real estate agent',
      description: 'List properties and connect with potential buyers and tenants.',
      icon: 'briefcase',
      color: theme.colors.agent,
    },
  ];

  const handleContinue = () => {
    // Navigate to register screen with selected user type
    navigation.navigate('Register', { userType: selectedType });
  };

  const renderUserTypeCard = (type) => {
    const isSelected = selectedType === type.id;
    
    return (
      <TouchableOpacity
        key={type.id}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isSelected ? type.color : theme.colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => setSelectedType(type.id)}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isSelected ? type.color : theme.colors.lightGrey,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={type.icon}
            size={28}
            color={isSelected ? theme.colors.white : type.color}
          />
        </View>
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardTitle,
              {
                color: theme.colors.textPrimary,
                fontFamily: 'poppins-semibold',
              },
            ]}
          >
            {type.title}
          </Text>
          <Text
            style={[
              styles.cardDescription,
              {
                color: theme.colors.textSecondary,
                fontFamily: 'poppins-regular',
              },
            ]}
          >
            {type.description}
          </Text>
        </View>
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radioOuter,
              {
                borderColor: isSelected ? type.color : theme.colors.grey,
              },
            ]}
          >
            {isSelected && (
              <View
                style={[
                  styles.radioInner,
                  {
                    backgroundColor: type.color,
                  },
                ]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textPrimary,
                fontFamily: 'poppins-bold',
              },
            ]}
          >
            How will you use Hoza Home?
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
            Select the option that best describes your needs.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {userTypes.map(renderUserTypeCard)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          fullWidth
          disabled={!selectedType}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.backButtonText,
              {
                color: theme.colors.textSecondary,
                fontFamily: 'poppins-medium',
              },
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default UserTypeScreen;
