import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmergencyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Emergency Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontFamily: 'poppins-medium',
  },
});

export default EmergencyScreen;
