import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RentPaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rent Payment Screen</Text>
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

export default RentPaymentScreen;
