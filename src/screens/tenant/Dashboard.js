import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import AuthContext from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PropertyService from '../../services/propertyService';
import UserService from '../../services/userService';

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [notifications, setNotifications] = useState({ notifications: [], unreadCount: 0 });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured rental properties
      const featured = await PropertyService.getFeaturedProperties('rent', 4);
      setFeaturedProperties(featured);
      
      // Fetch lease agreements
      const leases = await UserService.getLeaseAgreements(user.id, 'tenant');
      setLeaseAgreements(leases);
      
      // Fetch pending payments
      const payments = await UserService.getPendingRentPayments(user.id, 'tenant');
      setPendingPayments(payments);
      
      // Fetch recent maintenance requests
      const requests = await UserService.getMaintenanceRequests(user.id, 'tenant');
      setMaintenanceRequests(requests);
      
      // Fetch notifications
      const notifs = await UserService.getNotifications(user.id, 5, 0);
      setNotifications(notifs);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
      return () => {};
    }, [user])
  );
  
  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };
  
  // Handle emergency button press
  const handleEmergency = () => {
    navigation.navigate('Emergency');
  };
  
  // Navigate to rent payment
  const handlePayRent = (payment) => {
    navigation.navigate('RentPayment', { payment });
  };
  
  // Navigate to property details
  const handlePropertyPress = (property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
  };
  
  // Navigate to notifications
  const handleViewAllNotifications = () => {
    navigation.navigate('Notifications');
  };
  
  // Render greeting based on time of day
  const renderGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    
    return `${greeting}, ${user.name.split(' ')[0]}`;
  };

  // Render a payment card
  const renderPaymentCard = (payment) => {
    const dueDate = new Date(payment.dueDate);
    const formattedDate = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    return (
      <Card key={payment.id} style={styles.paymentCard}>
        <View style={styles.paymentCardHeader}>
          <View style={styles.paymentCardLeft}>
            <Text
              style={[
                styles.paymentCardTitle,
                { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
              ]}
              numberOfLines={1}
            >
              {payment.property.title}
            </Text>
            <Text
              style={[
                styles.paymentCardSubtitle,
                { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
              ]}
              numberOfLines={1}
            >
              Due: {formattedDate}
            </Text>
          </View>
          <View style={styles.paymentCardRight}>
            <Text
              style={[
                styles.paymentCardAmount,
                { color: theme.colors.primary, fontFamily: 'poppins-bold' },
              ]}
            >
              ${payment.amount}
            </Text>
          </View>
        </View>
        <Button
          title="Pay Now"
          onPress={() => handlePayRent(payment)}
          variant="primary"
          size="small"
          fullWidth
        />
      </Card>
    );
  };

  // Render a property card for featured properties
  const renderPropertyCard = (property) => {
    return (
      <TouchableOpacity
        key={property.id}
        style={[
          styles.propertyCard,
          { backgroundColor: theme.colors.surface, ...theme.shadows.light },
        ]}
        onPress={() => handlePropertyPress(property)}
      >
        <Image
          source={{ uri: property.images[0] }}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={styles.propertyCardContent}>
          <Text
            style={[
              styles.propertyCardPrice,
              { color: theme.colors.primary, fontFamily: 'poppins-semibold' },
            ]}
          >
            ${property.price}/mo
          </Text>
          <Text
            style={[
              styles.propertyCardTitle,
              { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
            ]}
            numberOfLines={1}
          >
            {property.title}
          </Text>
          <Text
            style={[
              styles.propertyCardLocation,
              { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
            ]}
            numberOfLines={1}
          >
            {property.location}
          </Text>
          <View style={styles.propertyCardFeatures}>
            <View style={styles.propertyCardFeature}>
              <MaterialCommunityIcons name="bed" size={14} color={theme.colors.textSecondary} />
              <Text
                style={[
                  styles.propertyCardFeatureText,
                  { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                ]}
              >
                {property.bedrooms}
              </Text>
            </View>
            <View style={styles.propertyCardFeature}>
              <MaterialCommunityIcons name="shower" size={14} color={theme.colors.textSecondary} />
              <Text
                style={[
                  styles.propertyCardFeatureText,
                  { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                ]}
              >
                {property.bathrooms}
              </Text>
            </View>
            <View style={styles.propertyCardFeature}>
              <MaterialCommunityIcons name="ruler-square" size={14} color={theme.colors.textSecondary} />
              <Text
                style={[
                  styles.propertyCardFeatureText,
                  { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                ]}
              >
                {property.area} sqft
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render notification item
  const renderNotificationItem = (notification) => {
    let icon = 'bell-outline';
    let iconColor = theme.colors.primary;
    
    switch (notification.type) {
      case 'reminder':
        icon = 'bell-ring-outline';
        iconColor = theme.colors.warning;
        break;
      case 'application':
        icon = 'file-document-outline';
        iconColor = theme.colors.primary;
        break;
      case 'maintenance':
        icon = 'tools';
        iconColor = theme.colors.secondary;
        break;
      case 'payment':
        icon = 'cash-multiple';
        iconColor = theme.colors.success;
        break;
      default:
        icon = 'bell-outline';
        iconColor = theme.colors.primary;
    }
    
    const date = new Date(notification.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationItem,
          !notification.read && { backgroundColor: `${theme.colors.primary}10` },
        ]}
      >
        <View
          style={[
            styles.notificationIcon,
            { backgroundColor: `${iconColor}20` },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationTitle,
              { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            style={[
              styles.notificationMessage,
              { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
            ]}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
        </View>
        <Text
          style={[
            styles.notificationDate,
            { color: theme.colors.textTertiary, fontFamily: 'poppins-regular' },
          ]}
        >
          {formattedDate}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render a section header with view all option
  const renderSectionHeader = (title, onViewAll, count = null) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.textPrimary, fontFamily: 'poppins-semibold' },
          ]}
        >
          {title}
        </Text>
        {count !== null && (
          <View
            style={[
              styles.countBadge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.countBadgeText,
                { color: theme.colors.white, fontFamily: 'poppins-medium' },
              ]}
            >
              {count}
            </Text>
          </View>
        )}
      </View>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text
            style={[
              styles.viewAllText,
              { color: theme.colors.primary, fontFamily: 'poppins-medium' },
            ]}
          >
            View All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.greeting,
                { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
              ]}
            >
              {renderGreeting()}
            </Text>
            <Text
              style={[
                styles.welcomeText,
                { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
              ]}
            >
              Welcome to your tenant dashboard
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.emergencyButton,
              { backgroundColor: theme.colors.error },
            ]}
            onPress={handleEmergency}
          >
            <MaterialCommunityIcons name="phone" size={20} color="white" />
            <Text
              style={[
                styles.emergencyButtonText,
                { color: theme.colors.white, fontFamily: 'poppins-medium' },
              ]}
            >
              Emergency
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[
              styles.quickActionItem,
              { backgroundColor: theme.colors.surface, ...theme.shadows.light },
            ]}
            onPress={() => navigation.navigate('SearchProperties')}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${theme.colors.tenant}20` },
              ]}
            >
              <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.tenant} />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
              ]}
            >
              Find Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickActionItem,
              { backgroundColor: theme.colors.surface, ...theme.shadows.light },
            ]}
            onPress={() => navigation.navigate('LeaseAgreements')}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${theme.colors.primary}20` },
              ]}
            >
              <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.primary} />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
              ]}
            >
              My Leases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickActionItem,
              { backgroundColor: theme.colors.surface, ...theme.shadows.light },
            ]}
            onPress={() => navigation.navigate('SavedProperties')}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${theme.colors.secondary}20` },
              ]}
            >
              <MaterialCommunityIcons name="heart-outline" size={24} color={theme.colors.secondary} />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickActionItem,
              { backgroundColor: theme.colors.surface, ...theme.shadows.light },
            ]}
            onPress={() => navigation.navigate('Communication')}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${theme.colors.info}20` },
              ]}
            >
              <MaterialCommunityIcons name="message-outline" size={24} color={theme.colors.info} />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
              ]}
            >
              Messages
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pending Payments Section */}
        {pendingPayments.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Pending Payments', null, pendingPayments.length)}
            <View style={styles.paymentsContainer}>
              {pendingPayments.map(renderPaymentCard)}
            </View>
          </View>
        )}

        {/* Notifications Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Notifications',
            handleViewAllNotifications,
            notifications.unreadCount
          )}
          {notifications.notifications.length > 0 ? (
            <View style={styles.notificationsContainer}>
              {notifications.notifications.map(renderNotificationItem)}
            </View>
          ) : (
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
              ]}
            >
              No new notifications
            </Text>
          )}
        </View>

        {/* Featured Properties Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            'Featured Properties',
            () => navigation.navigate('SearchProperties')
          )}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredPropertiesContainer}
          >
            {featuredProperties.map(renderPropertyCard)}
          </ScrollView>
        </View>

        {/* Maintenance Section */}
        <View style={styles.section}>
          {renderSectionHeader('Recent Maintenance', null)}
          {maintenanceRequests.length > 0 ? (
            <Card style={styles.maintenanceCard}>
              <View style={styles.maintenanceCardHeader}>
                <View
                  style={[
                    styles.maintenanceStatusDot,
                    {
                      backgroundColor:
                        maintenanceRequests[0].status === 'completed'
                          ? theme.colors.success
                          : maintenanceRequests[0].status === 'scheduled'
                          ? theme.colors.warning
                          : theme.colors.primary,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.maintenanceStatus,
                    { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                  ]}
                >
                  {maintenanceRequests[0].status.charAt(0).toUpperCase() +
                    maintenanceRequests[0].status.slice(1)}
                </Text>
              </View>
              <Text
                style={[
                  styles.maintenanceTitle,
                  { color: theme.colors.textPrimary, fontFamily: 'poppins-medium' },
                ]}
              >
                {maintenanceRequests[0].title}
              </Text>
              <Text
                style={[
                  styles.maintenanceProperty,
                  { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                ]}
                numberOfLines={1}
              >
                {maintenanceRequests[0].property.title}
              </Text>
              <Text
                style={[
                  styles.maintenanceDescription,
                  { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
                ]}
                numberOfLines={2}
              >
                {maintenanceRequests[0].description}
              </Text>
              {maintenanceRequests[0].scheduledDate && (
                <View style={styles.maintenanceSchedule}>
                  <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.primary} />
                  <Text
                    style={[
                      styles.maintenanceScheduleText,
                      { color: theme.colors.primary, fontFamily: 'poppins-medium' },
                    ]}
                  >
                    {new Date(maintenanceRequests[0].scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              )}
            </Card>
          ) : (
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.textSecondary, fontFamily: 'poppins-regular' },
              ]}
            >
              No maintenance requests
            </Text>
          )}
          <Button
            title="Report an Issue"
            onPress={() => navigation.navigate('MaintenanceTracker')}
            variant="outlined"
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emergencyButtonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionItem: {
    width: '23%',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
  },
  countBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  countBadgeText: {
    fontSize: 12,
  },
  viewAllText: {
    fontSize: 14,
  },
  paymentsContainer: {
    marginBottom: 8,
  },
  paymentCard: {
    marginBottom: 12,
    padding: 16,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentCardLeft: {
    flex: 1,
  },
  paymentCardTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  paymentCardSubtitle: {
    fontSize: 14,
  },
  paymentCardRight: {},
  paymentCardAmount: {
    fontSize: 18,
  },
  notificationsContainer: {
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  notificationDate: {
    fontSize: 12,
  },
  featuredPropertiesContainer: {
    paddingBottom: 8,
  },
  propertyCard: {
    width: 220,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 120,
  },
  propertyCardContent: {
    padding: 12,
  },
  propertyCardPrice: {
    fontSize: 16,
    marginBottom: 4,
  },
  propertyCardTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  propertyCardLocation: {
    fontSize: 12,
    marginBottom: 8,
  },
  propertyCardFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyCardFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyCardFeatureText: {
    fontSize: 12,
    marginLeft: 4,
  },
  maintenanceCard: {
    padding: 16,
    marginBottom: 16,
  },
  maintenanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  maintenanceStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  maintenanceStatus: {
    fontSize: 14,
  },
  maintenanceTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  maintenanceProperty: {
    fontSize: 14,
    marginBottom: 8,
  },
  maintenanceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  maintenanceSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maintenanceScheduleText: {
    fontSize: 14,
    marginLeft: 6,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default DashboardScreen;
