import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { fonts } from 'react-native-elements/dist/config';


export default function BadHabitScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Pressable style={styles.pressable}>
          <Text style={{fontSize: 24, marginLeft: 16}}>Add new habit.                  <AntDesign name="pluscircle" size={24} color="black" /></Text>
        </Pressable>
      </View>
      <View style={[styles.row, {top: 76, backgroundColor: "red"}]}>
        <View style={styles.pressable}>
          <Text style={{fontSize: 24, marginLeft: 10}}> Time since bad habits:</Text>
        </View>
      </View>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressable: {
    flex: 1,
    padding: 20
  },
  row: {
    flexDirection: 'row',
    top: 0,
    position:"absolute",
    backgroundColor: "aquamarine"
  },
  textAlign: {
    textAlign: "center",
    fontSize: 24
  }
});
