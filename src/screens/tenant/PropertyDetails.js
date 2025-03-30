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
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <Text
            style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' }]}
            numberOfLines={1}
          >
            {property.title}
          </Text>
          
          <TouchableOpacity onPress={handleToggleFavorite}>
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? theme.colors.error : theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            data={property.images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
              setActiveImage(newIndex);
            }}
          />
          
          {renderGalleryIndicator()}
          
          {/* Back and share buttons */}
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
            onPress={handleBack}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
              onPress={handleToggleFavorite}
            >
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? theme.colors.error : theme.colors.white}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
              onPress={handleShare}
            >
              <MaterialCommunityIcons name="share-variant" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Property Details */}
        <View style={styles.detailsContainer}>
          {/* Property title and price */}
          <View style={styles.titleContainer}>
            <Text style={[styles.propertyTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
              {property.title}
            </Text>
            <Text style={[styles.propertyPrice, { color: theme.colors.primary, fontFamily: 'poppins-bold' }]}>
              {formatPrice(property.price)}
            </Text>
          </View>
          
          {/* Property location */}
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.locationText, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
              {property.location}
            </Text>
          </View>
          
          {/* Property features */}
          <View style={styles.featuresContainer}>
            {renderFeature('bed', property.bedrooms, 'Bedrooms')}
            {renderFeature('shower', property.bathrooms, 'Bathrooms')}
            {renderFeature('ruler-square', property.area, 'Sq Ft')}
          </View>
          
          {/* Property description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
              Description
            </Text>
            <Text style={[styles.descriptionText, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
              {property.description}
            </Text>
          </View>
          
          {/* Property amenities */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
              Amenities
            </Text>
            <View style={styles.amenitiesContainer}>
              {property.amenities.map(renderAmenity)}
            </View>
          </View>
          
          {/* Landlord information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
              Landlord
            </Text>
            <Card style={styles.landlordCard}>
              <View style={styles.landlordContent}>
                <Image
                  source={{ uri: landlord.avatar }}
                  style={styles.landlordAvatar}
                />
                <View style={styles.landlordInfo}>
                  <Text style={[styles.landlordName, { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' }]}>
                    {landlord.name}
                  </Text>
                  <View style={styles.landlordRating}>
                    <MaterialCommunityIcons name="star" size={16} color={theme.colors.secondary} />
                    <Text style={[styles.landlordRatingText, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
                      {landlord.rating} ({landlord.reviews} reviews)
                    </Text>
                  </View>
                  <Text style={[styles.landlordDetails, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
                    Response time: {landlord.responseTime}
                  </Text>
                </View>
              </View>
              <Button
                title="Contact Landlord"
                onPress={handleContactLandlord}
                variant="outlined"
                size="small"
                style={{ marginTop: 12 }}
              />
            </Card>
          </View>
          
          {/* Similar properties */}
          {similarProperties.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' }]}>
                Similar Properties
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarPropertiesContainer}
              >
                {similarProperties.map((item) => renderSimilarProperty(item))}
              </ScrollView>
            </View>
          )}
        </View>
      </Animated.ScrollView>
      
      {/* Bottom action bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={[styles.bottomBarPrice, { color: theme.colors.primary, fontFamily: 'poppins-bold' }]}>
              {formatPrice(property.price)}
            </Text>
            <Text style={[styles.bottomBarSubtext, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
              {property.available ? 'Available Now' : 'Currently Unavailable'}
            </Text>
          </View>
          
          <Button
            title="Apply for Rental"
            onPress={handleApplyForRental}
            variant="primary"
            size="medium"
            disabled={!property.available}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 100,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 16,
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    marginHorizontal: 16,
  },
  galleryContainer: {
    height: 300,
    position: 'relative',
  },
  imageItem: {
    width,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 18,
    marginTop: 4,
  },
  featureLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
  },
  landlordCard: {
    padding: 16,
  },
  landlordContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landlordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  landlordInfo: {
    marginLeft: 12,
    flex: 1,
  },
  landlordName: {
    fontSize: 16,
    marginBottom: 4,
  },
  landlordRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  landlordRatingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  landlordDetails: {
    fontSize: 14,
  },
  similarPropertiesContainer: {
    paddingBottom: 8,
  },
  similarPropertyCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  similarPropertyImage: {
    width: '100%',
    height: 120,
  },
  similarPropertyContent: {
    padding: 12,
  },
  similarPropertyPrice: {
    fontSize: 16,
    marginBottom: 4,
  },
  similarPropertyTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  similarPropertyLocation: {
    fontSize: 12,
    marginBottom: 8,
  },
  similarPropertyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  similarPropertyFeature: {
    fontSize: 12,
  },
  bottomBar: {
    borderTopWidth: 1,
    padding: 16,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarPrice: {
    fontSize: 20,
  },
  bottomBarSubtext: {
    fontSize: 14,
  },
});
