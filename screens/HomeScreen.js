import React from 'react'
import { Text, View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton"


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today</Text>
      
      <Text>Daily Progress</Text>
      <Text>Daily Mood</Text>
      

      <CustomButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});