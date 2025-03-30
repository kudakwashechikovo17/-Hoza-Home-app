import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
import AuthContext from '../../contexts/AuthContext';

const HeaderRight = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  
  // In a real app, notification count would come from the backend
  const notificationCount = 3;

  // Handle notification icon press
  const handleNotificationPress = () => {
    // Navigate to the relevant notifications screen based on user role
    switch (user?.role) {
      case 'tenant':
        navigation.navigate('Notifications');
        break;
      case 'landlord':
        navigation.navigate('Notifications');
        break;
      case 'buyer':
        navigation.navigate('Notifications');
        break;
      case 'agent':
        navigation.navigate('Notifications');
        break;
      case 'admin':
        navigation.navigate('Notifications');
        break;
      default:
        console.log('No role defined');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={handleNotificationPress}
      >
        <MaterialCommunityIcons name="bell-outline" size={24} color="#333" />
        {notificationCount > 0 && (
          <Badge style={styles.badge}>{notificationCount}</Badge>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F4A259',
  },
});

export default HeaderRight;
