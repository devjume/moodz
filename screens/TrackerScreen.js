import React, { useState } from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet, TextInput } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';


export default function TrackerScreen() {

  const [activity, setActivity] = useState("");
  const [minutes, setMinutes] = useState("")
  const [hours, setHours] = useState("")
  const activities = ["Sleep", "Exercise", "Relax"];

  return (
    <View style={styles.container}>
      <Text style={styles.selectionHeader}>Activity:</Text>
      <SelectDropdown
        data={activities}
        defaultValueByIndex={0}
        onSelect={a => setActivity(a)}
      >

      </SelectDropdown>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <Text style={styles.selectionHeader}>Hours</Text>
          <TextInput
            style={styles.inputHours}
            onChangeText={setHours}
            value={hours}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.selectionHeader}>Minutes</Text>
          <TextInput
            style={styles.inputMinutes}
            onChangeText={setMinutes}
            value={minutes}
            keyboardType="numeric"
          />
        </View>
      </View>

    </View>
  )
}
