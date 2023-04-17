import React, { useEffect, useState } from 'react';
import styles from '../style/style';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { supabase } from '../lib/supabase';




export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSupabaseData(selectedDate);
  }, [selectedDate]);

  const fetchSupabaseData = async (date) => {
    const { data, error } = await supabase
      .from('daily_track')
      .select('date, mood')


    if (error) {
      console.error(error);
    } else {
      const newData = {};
      data.forEach((item) => {
        newData[item.date] = item;
      });
      setData(newData);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

/*   const renderDay = (day) => {
    const date = day.dateString;
    const event = data[date] || {};

    return (
      <View>
        <Text>Sleep: {event.sleep || '-'}</Text>
        <Text>Exercise: {event.exercise || '-'}</Text>
        <Text>Relax: {event.relax || '-'}</Text>
      </View>
    );
  };  */


  const renderModal = () => {
    const event = data[selectedDate] || {};

    return (
      <Modal  visible={modalVisible} animationType="slide">
        <View style={styles.calendar}>
          <Text>Date: {selectedDate}</Text> 
          <Text>Sleep: {event.sleep || '-'}</Text>
          <Text>Exercise: {event.exercise || '-'}</Text>
          <Text>Relax: {event.relax || '-'}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <View>
      <CalendarList onDayPress={handleDayPress} markedDates={{ [selectedDate]: { selected: true } }} 
            pastScrollRange={12}
            futureScrollRange={20}
            scrollEnabled={true}/>
      {selectedDate && renderModal()}
    </View>
  );
}

