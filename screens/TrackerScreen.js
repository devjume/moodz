import React, { useState } from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';


export default function TrackerScreen() {

  const [activity, setActivity] = useState("");
  const activities = ["Sleep", "Exercise", "Relax"];

  return (
    <View style={styles.container}>
      <Text>Tracker</Text>
      <SelectDropdown
        data={activities}
        defaultValueByIndex={0}
        onSelect={a => setActivity(a)}
        >
      </SelectDropdown>
      <Text>{activity}</Text>
    </View>
  )
}

