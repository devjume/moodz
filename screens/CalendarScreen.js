import React, {useState, useEffect} from 'react';
import styles from '../style/style';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, View,} from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';



export default function CalendarScreen() {




    const [events, setEvents] = useState({});
    const [markedDates, setMarkedDates] = useState({
      '2023-04-12': { marked: true, dotColor: 'blue' },
      '2023-04-14': { marked: true, dotColor: 'green' },
      '2023-04-16': { marked: true, dotColor: 'yellow' },
    });
  
    const handleAddEvent = (date, eventType) => {
      const newMarkedDates = {
        ...markedDates,
        [date]: { marked: true, dotColor: getDotColor(eventType) },
      };
      setMarkedDates(newMarkedDates);
    };
  
    const getDotColor = (eventType) => {
      switch (eventType) {
        case 'sleep':
          return 'blue';
        case 'exercise':
          return 'green';
        case 'relax':
          return 'yellow';
        default:
          return 'gray';
      }
    }

    

   
    const sleep = {key: 'sleep', color: 'green'};
    const exercise = {key: 'exercise', color: 'red'};
    const relax = {key: 'relax', color: 'blue'};

    const onDayPress = (day) => {
      const newEvent = {
        [day.dateString]: {
          selected: true,
          marked: true,
          dotColor: 'blue'
        }
      }
      setEvents({ ...events, ...newEvent });
    }

/*     const marked = {
      '2023-12-01': {
        dots: [sleep, exercise]
      },
      '2023-12-02': {
        dots: [relax, exercise, sleep]
      } 
    
    }
 */
    


     const changeColor = () => {

      if (buttonColor='green') {
          setColor('red')
      } else if (buttonColor='red') {
          setColor('green')
      } else {
          setColor('blue')
      }
  }
    

  async function getDailyData () {
    let { data: daily_track, error } = await supabase
        .from('daily_track')
        .select('some_column,other_column')
    

        
      if(error) {
      Alert.alert("Error", error.message);
      return 
    }	 else {
			setDailyData(daily_track)
		}

  }
    
     

 
  return (


   
    <View style={styles.container}> 
    

   <CalendarList


      onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
      pastScrollRange={12}
      futureScrollRange={20}
      scrollEnabled={true}
      markingType="multi-dot"
      markedDates={events}
      onDayPress={onDayPress} 
     // onDayPress={(day) => {handleAddEvent}}
      
      showScrollIndicator={true}
      

      /> 








    </View>
  )
}

