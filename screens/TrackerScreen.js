import React, { useState } from 'react'
import { Text, View, StyleSheet } from "react-native";
import SelectDropdown from 'react-native-select-dropdown'


export default function TrackerScreen() {

  const [activity, setActivity] = useState("");
  const activities = ["Sleep", "Exercise", "Relax"];

  return (
    <View style={styles.container}>
      <Text>Tracker</Text>
      <SelectDropdown
        data={activities}
        defaultValueByIndex={0}
        onSelect={a => setActivity}
        >
        <Text>{activity}</Text>
      </SelectDropdown>
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