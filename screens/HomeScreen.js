import React from 'react'
import styles from '../style/style';
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

