import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, Divider } from 'react-native-paper';
import Modal from 'react-native-modal';
import Button from '../common/Button';
import Input from '../common/Input';

const PropertyFilter = ({
  filters,
  onApplyFilters,
  onResetFilters,
  propertyTypes = ['apartment', 'house', 'villa', 'land'],
}) => {
  const theme = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Toggle filter modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    // Reset temp filters to current filters when opening modal
    if (!isModalVisible) {
      setTempFilters({ ...filters });
    }
  };

  // Apply filters and close modal
  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
    setModalVisible(false);
  };

  // Reset filters to default values
  const handleResetFilters = () => {
    const resetFilters = {
      priceMin: 0,
      priceMax: 10000,
      bedrooms: 'any',
      bathrooms: 'any',
      propertyType: 'any',
      amenities: [],
      keyword: '',
    };
    setTempFilters(resetFilters);
    onResetFilters(resetFilters);
  };

  // Update a specific filter property
  const updateFilter = (key, value) => {
    setTempFilters({
      ...tempFilters,
      [key]: value,
    });
  };

  // Toggle an amenity in the filters
  const toggleAmenity = (amenity) => {
    const currentAmenities = [...tempFilters.amenities];
    const index = currentAmenities.indexOf(amenity);
    
    if (index === -1) {
      // Add amenity if not present
      setTempFilters({
        ...tempFilters,
        amenities: [...currentAmenities, amenity],
      });
    } else {
      // Remove amenity if already present
      currentAmenities.splice(index, 1);
      setTempFilters({
        ...tempFilters,
        amenities: currentAmenities,
      });
    }
  };

  // Render the filter button that opens the modal
  const renderFilterButton = () => (
    <TouchableOpacity 
      style={[
        styles.filterButton, 
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]} 
      onPress={toggleModal}
    >
      <MaterialCommunityIcons name="filter-variant" size={20} color={theme.colors.primary} />
      <Text style={[styles.filterButtonText, { color: theme.colors.textPrimary }]}>
        Filter
      </Text>
      {hasActiveFilters() && (
        <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.filterBadgeText, { color: theme.colors.white }]}>
            {countActiveFilters()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Check if there are any active filters
  const hasActiveFilters = () => {
    return (
      filters.priceMin > 0 ||
      filters.priceMax < 10000 ||
      filters.bedrooms !== 'any' ||
      filters.bathrooms !== 'any' ||
      filters.propertyType !== 'any' ||
      filters.amenities.length > 0 ||
      filters.keyword.trim() !== ''
    );
  };

  // Count the number of active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.priceMin > 0) count++;
    if (filters.priceMax < 10000) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    if (filters.propertyType !== 'any') count++;
    if (filters.amenities.length > 0) count++;
    if (filters.keyword.trim() !== '') count++;
    return count;
  };

  // Render number selection buttons (bedrooms, bathrooms)
  const renderNumberSelection = (title, key, options) => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            tempFilters[key] === 'any' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
          ]}
          onPress={() => updateFilter(key, 'any')}
        >
          <Text
            style={[
              styles.optionText,
              { color: tempFilters[key] === 'any' ? theme.colors.white : theme.colors.textPrimary },
            ]}
          >
            Any
          </Text>
        </TouchableOpacity>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              tempFilters[key] === option && { 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => updateFilter(key, option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: tempFilters[key] === option ? theme.colors.white : theme.colors.textPrimary },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render property type selection
  const renderPropertyTypeSelection = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Property Type
      </Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            tempFilters.propertyType === 'any' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
          ]}
          onPress={() => updateFilter('propertyType', 'any')}
        >
          <Text
            style={[
              styles.typeText,
              { color: tempFilters.propertyType === 'any' ? theme.colors.white : theme.colors.textPrimary },
            ]}
          >
            Any
          </Text>
        </TouchableOpacity>
        {propertyTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              tempFilters.propertyType === type && { 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => updateFilter('propertyType', type)}
          >
            <Text
              style={[
                styles.typeText,
                { color: tempFilters.propertyType === type ? theme.colors.white : theme.colors.textPrimary },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render amenities checkboxes
  const renderAmenities = () => {
    const amenities = [
      'Parking', 'Swimming Pool', 'Gym', 'Security', 
      'Air Conditioning', 'Furnished', 'Pet Friendly', 'Balcony'
    ];
    
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Amenities
        </Text>
        <View style={styles.amenitiesContainer}>
          {amenities.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={styles.amenityRow}
              onPress={() => toggleAmenity(amenity)}
            >
              <MaterialCommunityIcons
                name={tempFilters.amenities.includes(amenity) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={tempFilters.amenities.includes(amenity) ? theme.colors.primary : theme.colors.grey}
              />
              <Text style={[styles.amenityText, { color: theme.colors.textPrimary }]}>
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterButton()}
      
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        backdropOpacity={0.5}
        style={styles.modal}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
              Filters
            </Text>
            <TouchableOpacity onPress={toggleModal}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Keyword search */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Keyword
              </Text>
              <Input
                placeholder="Search by keyword"
                value={tempFilters.keyword}
                onChangeText={(text) => updateFilter('keyword', text)}
                icon="magnify"
              />
            </View>
            
            <Divider style={styles.divider} />
            
            {/* Price Range */}
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Price Range
              </Text>
              <View style={styles.priceContainer}>
                <View style={styles.priceInputContainer}>
                  <Input
                    placeholder="Min"
                    value={tempFilters.priceMin.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      updateFilter('priceMin', value);
                    }}
                    keyboardType="numeric"
                    style={{ flex: 1 }}
                  />
                  <Text style={[styles.priceSeparator, { color: theme.colors.textSecondary }]}>to</Text>
                  <Input
                    placeholder="Max"
                    value={tempFilters.priceMax.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      updateFilter('priceMax', value);
                    }}
                    keyboardType="numeric"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            {/* Bedrooms selection */}
            {renderNumberSelection('Bedrooms', 'bedrooms', ['1', '2', '3', '4', '5+'])}
            
            <Divider style={styles.divider} />
            
            {/* Bathrooms selection */}
            {renderNumberSelection('Bathrooms', 'bathrooms', ['1', '2', '3', '4+'])}
            
            <Divider style={styles.divider} />
            
            {/* Property type selection */}
            {renderPropertyTypeSelection()}
            
            <Divider style={styles.divider} />
            
            {/* Amenities */}
            {renderAmenities()}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Button 
              title="Reset" 
              onPress={handleResetFilters} 
              variant="outlined"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button 
              title="Apply Filters" 
              onPress={handleApplyFilters} 
              variant="primary"
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
