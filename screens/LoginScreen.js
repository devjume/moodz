import React from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton"


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>LOGIN SCREEN</Text>

      <CustomButton />
    </View>
  )
}

