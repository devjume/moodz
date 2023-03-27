import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';


export default function BadHabitScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Pressable style={styles.pressable}>
          <Text style={styles.textAlign}>Add new habit.          <AntDesign name="pluscircle" size={24} color="black" /></Text>
        </Pressable>
      </View>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    flex: 1,
    padding: 20,
    backgroundColor: "aquamarine"
  },
  row: {
    flexDirection: 'row',
    top: 0,
    position: "absolute"
  },
  textAlign: {
    textAlign: "center",
    fontSize: 24
  }
});
