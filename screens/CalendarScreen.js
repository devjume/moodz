import React from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet } from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


export default function CalendarScreen() {
  return (
    <View style={styles.container}> 
      <Text>Calendar</Text>

      <Calendar

     initialDate={'2023-03-01'}
     minDate={'2023-05-10'}
     maxDate={'2050-05-30'}
     onDayPress={day => {
     console.log('selected day', day);
     }}
     onDayLongPress={day => {
      console.log('selected day', day);
     }}
     monthFormat={'yyyy MM'}
     onMonthChange={month => {
      console.log('month changed', month);
     }}
      hideArrows={true}
     renderArrow={direction => <Arrow />}
     hideExtraDays={true}
     disableMonthChange={true}
     firstDay={1}
     hideDayNames={true}
     showWeekNumbers={true}
     onPressArrowLeft={subtractMonth => subtractMonth()}
     onPressArrowRight={addMonth => addMonth()}
     disableArrowLeft={true}
     disableArrowRight={true}
     disableAllTouchEventsForDisabledDays={true}
     renderHeader={date => {
      }}
      enableSwipeMonths={true}
    />
    </View>
  )
}

