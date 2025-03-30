import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import PropertyCard from './PropertyCard';
import Button from '../common/Button';

const PropertyList = ({
  properties,
  onPropertyPress,
  onFavoritePress,
  favorites = [],
  loading = false,
  error = null,
  onRetry,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  listVariant = 'standard', // 'standard', 'compact', 'horizontal'
  listStyle,
  emptyMessage = 'No properties found',
  showFavoriteButton = true,
}) => {
  const theme = useTheme();

  // Empty state component
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
            {error}
          </Text>
          {onRetry && (
            <Button 
              title="Retry" 
              onPress={onRetry} 
              variant="primary" 
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {emptyMessage}
        </Text>
      )}
    </View>
  );

  // Footer component for load more functionality
  const ListFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        {loadingMore ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Button 
            title="Load More" 
            onPress={onLoadMore} 
            variant="outlined" 
            size="small"
          />
        )}
      </View>
    );
  };

  // Function to check if a property is in favorites
  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  // Render function for each property
  const renderProperty = ({ item }) => (
    <PropertyCard
      property={item}
      onPress={() => onPropertyPress(item)}
      onFavoritePress={onFavoritePress}
      isFavorite={isFavorite(item.id)}
      showFavoriteButton={showFavoriteButton}
      variant={listVariant}
    />
  );

  return (
    <FlatList
      data={properties}
      renderItem={renderProperty}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[
        styles.listContainer,
        properties.length === 0 && styles.emptyListContainer,
        listStyle,
      ]}
      ListEmptyComponent={EmptyList}
      ListFooterComponent={ListFooter}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default PropertyList;
