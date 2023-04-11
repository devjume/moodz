import React, {useState, useEffect} from 'react';
import styles from '../style/style';
import { Text, View,} from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';



export default function CalendarScreen() {

/*   const sleep = [sleep, setSleep] = useState('yellow');
     const exercise = [exercise, setExercise] = useState('red');
     const relax = [relax, setRelax] = useState('blue');


     const changeColor = () => {

      if (buttonColor='green') {
          setColor('red')
      } else if (buttonColor='red') {
          setColor('green')
      } else {
          setColor('blue')
      }
  }
 */

  return (


   
    <View style={styles.container}> 
    
      <Text>Calendar</Text>

      
      


   <CalendarList


      onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
      // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={12}
    // Max amount of months allowed to scroll to the future. Default = 50
      futureScrollRange={50}
    // Enable or disable scrolling of calendar list
      scrollEnabled={true}
    // Enable or disable vertical scroll indicator. Default = false
      showScrollIndicator={true}

      />

{/*    /// markedDates={{
  ///      '2018-03-28': {
          
  ///        container: {
 //         style:{{backgroundColor:buttonColor, padding: 15}}
  //    },
  //    text: {
 //       color: 'black',
  //      fontWeight: 'bold'
  //    }
  //     }
  //     }}

 ///  markingType={'multi-dot'}
 ///  markedDates={{
 // '2023-10-25': {dots: [relax, sleep, exercise], selected: true, selectedColor: 'red'},
 // '2023-10-26': {dots: [sleep, exercise], disabled: true}
  // }}
   /> */}



    </View>
  )
}

