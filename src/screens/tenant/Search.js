import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AuthContext from '../../contexts/AuthContext';
import PropertyList from '../../components/property/PropertyList';
import PropertyFilter from '../../components/property/PropertyFilter';
import PropertyService from '../../services/propertyService';
import UserService from '../../services/userService';

const ITEMS_PER_PAGE = 10;

const SearchScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  
  const [favorites, setFavorites] = useState([]);
  
  // Default filters
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    bedrooms: 'any',
    bathrooms: 'any',
    propertyType: 'any',
    amenities: [],
    keyword: '',
  });

  // Load initial data
  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  // Load properties with current filters and search query
  const loadProperties = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(0);
      } else if (!refresh && !loadingMore) {
        setLoading(true);
      }
      
      setError(null);
      
      // Combine filters with search query
      const searchFilters = {
        ...filters,
        keyword: searchQuery || filters.keyword,
      };
      
      const offset = refresh ? 0 : page * ITEMS_PER_PAGE;
      
      const result = await PropertyService.getRentalProperties(
        searchFilters,
        ITEMS_PER_PAGE,
        offset
      );
      
      if (refresh || page === 0) {
        setProperties(result.properties);
      } else {
        setProperties((prevProperties) => [...prevProperties, ...result.properties]);
      }
      
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      
      if (refresh) {
        setPage(1);
      } else if (!refresh && !loadingMore) {
        setPage(1);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Load user's favorite properties
  const loadFavorites = async () => {
    try {
      // In a real app, we would fetch user's saved properties from the backend
      // For now, we'll use the mock data
      if (user.savedProperties) {
        setFavorites(user.savedProperties);
      } else {
        const userDetails = await UserService.getUserById(user.id);
        if (userDetails.savedProperties) {
          setFavorites(userDetails.savedProperties);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Handle property press
  const handlePropertyPress = (property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
  };

  // Handle favorite button press
  const handleFavoritePress = async (propertyId) => {
    try {
      // Toggle favorite status locally first for immediate feedback
      if (favorites.includes(propertyId)) {
        setFavorites(favorites.filter((id) => id !== propertyId));
      } else {
        setFavorites([...favorites, propertyId]);
      }
      
      // Then update in the backend
      await PropertyService.toggleSavedProperty(user.id, propertyId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert local change if API call fails
      loadFavorites();
    }
  };

  // Handle search query change
  const handleSearch = () => {
    setPage(0);
    loadProperties(true);
  };

  // Handle filter changes
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
    loadProperties(true);
  };

  // Handle filter reset
  const handleResetFilters = (defaultFilters) => {
    setFilters(defaultFilters);
    setPage(0);
    loadProperties(true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      loadProperties();
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadProperties(true);
  };

  // Handle retry after error
  const handleRetry = () => {
    setError(null);
    loadProperties();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary, fontFamily: 'poppins-regular' }]}
            placeholder="Search properties..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                // If there was a previous search, reset and load properties
                if (filters.keyword) {
                  setFilters({ ...filters, keyword: '' });
                  loadProperties(true);
                }
              }}
            >
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filtersRow}>
        <PropertyFilter
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
        
        <Text style={[styles.resultsCount, { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' }]}>
          {loading ? 'Loading...' : `${totalCount} results`}
        </Text>
      </View>
      
      <PropertyList
        properties={properties}
        onPropertyPress={handlePropertyPress}
        onFavoritePress={handleFavoritePress}
        favorites={favorites}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loadingMore={loadingMore}
        listVariant="standard"
        listStyle={styles.propertyList}
        emptyMessage="No properties found. Try adjusting your filters."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: '100%',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
  },
  propertyList: {
    paddingHorizontal: 16,
  },
});

export default SearchScreen;
