import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import tenant screens
import DashboardScreen from '../screens/tenant/Dashboard';
import SearchScreen from '../screens/tenant/Search';
import SavedPropertiesScreen from '../screens/tenant/SavedProperties';
import ApplyForRentalScreen from '../screens/tenant/ApplyForRental';
import LeaseAgreementsScreen from '../screens/tenant/LeaseAgreements';
import RentPaymentScreen from '../screens/tenant/RentPayment';
import CommunicationScreen from '../screens/tenant/Communication';
import ProfileScreen from '../screens/tenant/Profile';
import PropertyDetailsScreen from '../screens/tenant/PropertyDetails';
import EmergencyScreen from '../screens/tenant/Emergency';
import NotificationsScreen from '../screens/tenant/Notifications';

// Import shared components
import HeaderRight from '../components/common/HeaderRight';

// Create stacks for each tab
const DashboardStack = createStackNavigator();
const SearchStack = createStackNavigator();
const SavedStack = createStackNavigator();
const LeaseStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Dashboard Stack
const DashboardStackNavigator = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen 
      name="TenantDashboard" 
      component={DashboardScreen} 
      options={({ navigation }) => ({
        title: 'Dashboard',
        headerRight: () => <HeaderRight navigation={navigation} />,
      })}
    />
    <DashboardStack.Screen name="Notifications" component={NotificationsScreen} />
    <DashboardStack.Screen name="RentPayment" component={RentPaymentScreen} />
    <DashboardStack.Screen name="Emergency" component={EmergencyScreen} />
  </DashboardStack.Navigator>
);

// Search Stack
const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen 
      name="SearchProperties" 
      component={SearchScreen} 
      options={{ title: 'Find Properties' }}
    />
    <SearchStack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
    <SearchStack.Screen name="ApplyForRental" component={ApplyForRentalScreen} />
  </SearchStack.Navigator>
);

// Saved Properties Stack
const SavedStackNavigator = () => (
  <SavedStack.Navigator>
    <SavedStack.Screen 
      name="SavedProperties" 
      component={SavedPropertiesScreen} 
      options={{ title: 'Saved Properties' }}
    />
    <SavedStack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
  </SavedStack.Navigator>
);

// Lease Stack
const LeaseStackNavigator = () => (
  <LeaseStack.Navigator>
    <LeaseStack.Screen 
      name="LeaseAgreements" 
      component={LeaseAgreementsScreen} 
      options={{ title: 'My Leases' }}
    />
    <LeaseStack.Screen name="Communication" component={CommunicationScreen} />
  </LeaseStack.Navigator>
);

// Profile Stack
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'My Profile' }}
    />
  </ProfileStack.Navigator>
);

// Main Tab Navigator
const Tab = createBottomTabNavigator();

const TenantStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Leases') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5D9CEC',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedStackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Leases" 
        component={LeaseStackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TenantStack;
