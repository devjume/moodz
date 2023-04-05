import React, { useEffect, useState } from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker';


export default function TrackerScreen() {

  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  const [total, setTotal] = useState("")
  const [date, setDate] = useState(new Date());

  const activities = ["Sleep", "Exercise", "Relax"];

  function consoleLog(){
    let hoursToMinutes = parseFloat(hours)*60
    let totalMinutes = (hoursToMinutes + parseFloat(minutes))
    console.log(activity)
    console.log(minutes)
    console.log(hours)
    console.log(totalMinutes)
    console.log(date)
  }

  function sanitazedMinutes(text) {
    // Remove non-numeric characters
    const mins = text.replace(/[^0-9]/g, '');

    // Limit the input to 59
    if (mins.length > 2) {
      setValue(mins.slice(0, 2));
    } else {
      // Ensure numericValue is not greater than 59
      const sanitizedValue = parseInt(mins);
      if (sanitizedValue > 59) {
        setMinutes('59');
      } else {
        setMinutes(mins);
      }
    }
  };
  

  function sanitazedHours(text) {
    // Remove non-numeric characters
    const hrs = text.replace(/[^0-9]/g, '');

    // Limit the input to 23
    if (hrs.length > 2) {
      setValue(hrs.slice(0, 2));
    } else {
      // Ensure numericValue is not greater than 59
      const sanitizedValue = parseInt(hrs, 10);
      if (sanitizedValue > 23) {
        setHours('23');
        alert("Maximum time for a task is 23 hours and 59 minutes!")
      } else {
        setHours(hrs);
      }
    }
  };
  

  return (

    <View style={styles.container}>
      <Text style={styles.selectionHeader}>Activity:</Text>
      <View style={{ minHeight: 250 }}>
        <SelectDropdown
          data={activities}
          onSelect={a => setActivity(a)}
          dropdownOverlayColor={"#000000"}

        />
      </View>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <Text style={styles.selectionHeader}>Duration</Text>
          <TextInput
            style={styles.inputHours}
            onChangeText={text => sanitazedHours(text)}
            value={hours}
            maxLength={2}
            keyboardType="numeric"
            placeholder='hours'
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.selectionHeader}></Text>
          <TextInput
            style={styles.inputMinutes}
            onChangeText={text => sanitazedMinutes(text)}
            maxLength={2}
            value={minutes}
            keyboardType="numeric"
            placeholder='minutes'
          />
        </View>
      </View>
      <View style={{height:100}}>
      <DatePicker date={date} setDate={setDate}/>
      </View>
      <Pressable style={styles.button} onPress={consoleLog}>
        <Text>Save</Text>
      </Pressable>
    </View>
  )
}
