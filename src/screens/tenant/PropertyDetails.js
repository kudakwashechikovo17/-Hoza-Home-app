import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthContext from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PropertyService from '../../services/propertyService';

const { width } = Dimensions.get('window');

const PropertyDetailsScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { propertyId } = route.params;
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [landlord, setLandlord] = useState(null);
  
  // Load property details
  useEffect(() => {
    const loadPropertyDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch property details
        const propertyData = await PropertyService.getPropertyById(propertyId);
        setProperty(propertyData);
        
        // Check if property is in user favorites
        if (user.savedProperties) {
          setIsFavorite(user.savedProperties.includes(propertyId));
        }
        
        // Fetch similar properties
        const similar = await PropertyService.getSimilarProperties(propertyId);
        setSimilarProperties(similar);
        
        // Mock landlord data for demo purposes
        setLandlord({
          id: 'l1',
          name: 'Sarah Smith',
          responseTime: '< 1 hour',
          rating: 4.8,
          reviews: 24,
          properties: 12,
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        });
        
      } catch (error) {
        console.error('Error loading property details:', error);
        Alert.alert('Error', 'Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPropertyDetails();
  }, [propertyId, user]);
  
  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    try {
      // Toggle favorite state locally first for immediate feedback
      setIsFavorite(!isFavorite);
      
      // Update in the backend
      await PropertyService.toggleSavedProperty(user.id, propertyId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert local change if API call fails
      setIsFavorite(!isFavorite);
      Alert.alert('Error', 'Failed to update favorite status. Please try again.');
    }
  };
  
  // Handle share property
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property on Hoza Home: ${property.title} - ${property.location} for $${property.price}/month`,
        // In a real app, you would include a deep link to the property
      });
    } catch (error) {
      console.error('Error sharing property:', error);
    }
  };
  
  // Handle apply for rental
  const handleApplyForRental = () => {
    navigation.navigate('ApplyForRental', { property });
  };
  
  // Handle contact landlord
  const handleContactLandlord = () => {
    navigation.navigate('Communication', { 
      recipientId: landlord.id,
      recipientName: landlord.name,
      propertyId: property.id,
      propertyTitle: property.title,
    });
  };
  
  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
  };
  
  // Handle property card press
  const handlePropertyPress = (similarProperty) => {
    // Navigate to the same screen with new property ID
    navigation.push('PropertyDetails', { propertyId: similarProperty.id });
  };
  
  // Render loading state
  if (loading || !property) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  // Format price with currency
  const formatPrice = (price) => {
    return `$${price.toLocaleString()}/mo`;
  };
  
  // Render image gallery item
  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => setActiveImage(index)}
      style={styles.imageItem}
    >
      <Image 
        source={{ uri: item }} 
        style={styles.image} 
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );
  
  // Render gallery indicator
  const renderGalleryIndicator = () => (
    <View style={styles.indicatorContainer}>
      {property.images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            {
              backgroundColor: index === activeImage 
                ? theme.colors.primary 
                : theme.colors.lightGrey,
              width: index === activeImage ? 20 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
  
  // Render property features
  const renderFeature = (icon, value, label) => (
    <View style={styles.featureItem}>
      <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
      <Text style={[styles.featureValue, { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' }]}>
        {value}
      </Text>
      <Text style={[styles.featureLabel, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
        {label}
      </Text>
    </View>
  );
  
  // Render amenity item
  const renderAmenity = (amenity) => (
    <View key={amenity} style={styles.amenityItem}>
      <MaterialCommunityIcons 
        name={getAmenityIcon(amenity)} 
        size={20} 
        color={theme.colors.primary} 
      />
      <Text style={[styles.amenityText, { color: theme.colors.textPrimary, fontFamily: 'poppins-regular' }]}>
        {amenity}
      </Text>
    </View>
  );
  
  // Get icon for amenity
  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'Parking': 'car',
      'Swimming Pool': 'pool',
      'Gym': 'dumbbell',
      'Security': 'shield-check',
      'Borehole': 'water-pump',
      'Solar Power': 'solar-power',
      'Furnished': 'sofa',
      'Garden': 'flower',
      'DSTV': 'satellite-variant',
      'Balcony': 'balcony',
      'Wifi': 'wifi',
      'Air Conditioning': 'air-conditioner',
      'Electricity': 'flash',
      'Road Access': 'road-variant',
      'Pet Friendly': 'dog',
    };
    
    return amenityIcons[amenity] || 'check-circle';
  };
  
  // Render similar property card
  const renderSimilarProperty = (item) => (
    <TouchableOpacity
      style={[styles.similarPropertyCard, { backgroundColor: theme.colors.surface, ...theme.shadows.light }]}
      onPress={() => handlePropertyPress(item)}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.similarPropertyImage}
        resizeMode="cover"
      />
      <View style={styles.similarPropertyContent}>
        <Text style={[styles.similarPropertyPrice, { color: theme.colors.primary, fontFamily: 'poppins-semibold' }]}>
          ${item.price}/mo
        </Text>
        <Text style={[styles.similarPropertyTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.similarPropertyLocation, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.similarPropertyFeatures}>
          <Text style={[styles.similarPropertyFeature, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
            {item.bedrooms} bed{item.bedrooms !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.similarPropertyFeature, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
            {item.bathrooms} bath{item.bathrooms !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.similarPropertyFeature, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
            {item.area} sqft
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      {/* Animated header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            backgroundColor: theme.colors.background,
            opacity: headerOpacity,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.headerBackButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.te
