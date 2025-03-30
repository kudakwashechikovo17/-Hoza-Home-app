import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const Card = ({ 
  children, 
  style, 
  onPress, 
  elevation = 2,
  bordered = false,
  radius = 'medium',
  padding = 'medium',
}) => {
  const theme = useTheme();
  
  // Determine card border radius
  const getRadius = () => {
    switch (radius) {
      case 'small':
        return theme.borderRadius.s;
      case 'medium':
        return theme.borderRadius.m;
      case 'large':
        return theme.borderRadius.l;
      case 'none':
        return 0;
      default:
        return theme.borderRadius.m;
    }
  };
  
  // Determine card padding
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.s;
      case 'medium':
        return theme.spacing.m;
      case 'large':
        return theme.spacing.l;
      default:
        return theme.spacing.m;
    }
  };
  
  // Get shadow based on elevation
  const getShadow = () => {
    switch (elevation) {
      case 0:
        return {};
      case 1:
        return theme.shadows.light;
      case 2:
        return theme.shadows.medium;
      case 3:
        return theme.shadows.dark;
      default:
        return theme.shadows.medium;
    }
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderRadius: getRadius(),
      padding: getPadding(),
      ...(bordered && { 
        borderWidth: 1, 
        borderColor: theme.colors.border 
      }),
      ...getShadow(),
    },
    style,
  ];

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise, use a simple View
  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default Card;
