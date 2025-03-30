import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import Card from '../common/Card';

const PropertyCard = ({
  property,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = true,
  variant = 'standard', // 'standard', 'compact', 'horizontal'
}) => {
  const theme = useTheme();

  // Helper function to format price
  const formatPrice = (value) => {
    if (!value) return 'Price unavailable';
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Render compact card variant
  if (variant === 'compact') {
    return (
      <Card onPress={onPress} style={styles.compactCard}>
        <Image 
          source={{ uri: property.images[0] || 'https://via.placeholder.com/100' }} 
          style={styles.compactImage} 
          resizeMode="cover" 
        />
        <View style={styles.compactContent}>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {property.type === 'rent' ? `${formatPrice(property.price)}/mo` : formatPrice(property.price)}
          </Text>
          <Text 
            style={[styles.compactTitle, { color: theme.colors.textPrimary }]} 
            numberOfLines={1}
          >
            {property.title}
          </Text>
          <Text 
            style={[styles.compactLocation, { color: theme.colors.textSecondary }]} 
            numberOfLines={1}
          >
            {property.location}
          </Text>
        </View>
      </Card>
    );
  }

  // Render horizontal card variant
  if (variant === 'horizontal') {
    return (
      <Card onPress={onPress} style={styles.horizontalCard}>
        <Image 
          source={{ uri: property.images[0] || 'https://via.placeholder.com/150' }} 
          style={styles.horizontalImage} 
          resizeMode="cover" 
        />
        <View style={styles.horizontalContent}>
          <Text 
            style={[styles.title, { color: theme.colors.textPrimary }]} 
            numberOfLines={1}
          >
            {property.title}
          </Text>
          <Text 
            style={[styles.location, { color: theme.colors.textSecondary }]} 
            numberOfLines={1}
          >
            {property.location}
          </Text>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            {property.type === 'rent' ? `${formatPrice(property.price)}/mo` : formatPrice(property.price)}
          </Text>
          
          <View style={styles.horizontalFeatures}>
            <View style={styles.feature}>
              <MaterialCommunityIcons name="bed" size={16} color={theme.colors.grey} />
              <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                {property.bedrooms}
              </Text>
            </View>
            <View style={styles.feature}>
              <MaterialCommunityIcons name="shower" size={16} color={theme.colors.grey} />
              <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                {property.bathrooms}
              </Text>
            </View>
            <View style={styles.feature}>
              <MaterialCommunityIcons name="ruler-square" size={16} color={theme.colors.grey} />
              <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                {property.area} sqft
              </Text>
            </View>
          </View>
        </View>
        
        {showFavoriteButton && (
          <TouchableOpacity 
            style={[styles.favoriteButton, { top: 10, right: 10 }]} 
            onPress={() => onFavoritePress(property.id)}
          >
            <MaterialCommunityIcons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? theme.colors.error : theme.colors.white} 
            />
          </TouchableOpacity>
        )}
      </Card>
    );
  }

  // Default standard card variant
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: property.images[0] || 'https://via.placeholder.com/300' }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        {property.featured && (
          <View style={[styles.featuredBadge, { backgroundColor: theme.colors.secondary }]}>
            <Text style={[styles.featuredText, { color: theme.colors.white }]}>Featured</Text>
          </View>
        )}
        
        {showFavoriteButton && (
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => onFavoritePress(property.id)}
          >
            <MaterialCommunityIcons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? theme.colors.error : theme.colors.white} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.price, { color: theme.colors.primary }]}>
          {property.type === 'rent' ? `${formatPrice(property.price)}/mo` : formatPrice(property.price)}
        </Text>
        
        <Text 
          style={[styles.title, { color: theme.colors.textPrimary }]} 
          numberOfLines={1}
        >
          {property.title}
        </Text>
        
        <Text 
          style={[styles.location, { color: theme.colors.textSecondary }]} 
          numberOfLines={1}
        >
          {property.location}
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="bed" size={16} color={theme.colors.grey} />
            <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
              {property.bedrooms}
            </Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="shower" size={16} color={theme.colors.grey} />
            <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
              {property.bathrooms}
            </Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="ruler-square" size={16} color={theme.colors.grey} />
            <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
              {property.area} sqft
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  // Standard card styles
  card: {
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'poppins-medium',
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'poppins-regular',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'poppins-semibold',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'poppins-regular',
  },
  
  // Compact card styles
  compactCard: {
    flexDirection: 'row',
    marginBottom: 12,
    height: 100,
  },
  compactImage: {
    width: 100,
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  compactContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: 'poppins-medium',
  },
  compactLocation: {
    fontSize: 12,
    fontFamily: 'poppins-regular',
  },
  
  // Horizontal card styles
  horizontalCard: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 150,
  },
  horizontalImage: {
    width: 120,
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  horizontalFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default PropertyCard;
