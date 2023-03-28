import React, {useState, useEffect} from 'react';
import styles from '../style/style';
import { Text, View,} from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


export default function CalendarScreen() {

 ///  const sleep = [sleep, setSleep] = useState([]);
 //  const exercise = [exercise, setExercise] = useState([]);
  // const relax = [relax, setRelax] = useState([]);


  return (


   
    <View style={styles.container}> 
    
      <Text>Calendar</Text>

      

   <CalendarList

 ///  markingType={'multi-dot'}
 ///  markedDates={{
 // '2023-10-25': {dots: [relax, sleep, exercise], selected: true, selectedColor: 'red'},
 // '2023-10-26': {dots: [sleep, exercise], disabled: true}
  // }}
   />



    </View>
  )
}

