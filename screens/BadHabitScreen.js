import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { fonts } from 'react-native-elements/dist/config';


export default function BadHabitScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable 
        style={[styles.row, styles.column, {backgroundColor: "#DCC9B6"}]}
        onPress={()=>console.log("nappi")}>
        <Text style={{fontSize: 24}}>Add new habit.                  <AntDesign name="pluscircle" size={24} color="black" /></Text>
      </Pressable>
      <View style={[styles.row, {}]}>
        <View style={styles.card}>
          <Text style={{fontSize: 24}}>Time since bad habits:</Text>
        </View>
      </View>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCC9B6"
  },
  pressable: {
   backgroundColor: "#FFEDD7"
    
  },
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#FFEDD7"
  },
  textAlign: {
    textAlign: "center",
    fontSize: 24
  }
});
