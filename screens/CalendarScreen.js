import React, { useEffect, useState } from 'react';
import styles from '../style/style';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { supabase } from '../lib/supabase';




export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    fetchSupabaseData(selectedDate);
  }, [selectedDate]);

  const fetchSupabaseData = async (date) => {
    const { data, error } = await supabase
      .from('daily_track')
      .select('date, mood')
      .gte('date', date)
      .lte('date', `${date.slice(0, 4)}-12-31`);

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
  };

  const renderDay = (day) => {
    const date = day.dateString;
    const event = data[date] || {};

    return (
      <View>
        <Text>Sleep: {event.sleep || '-'}</Text>
        <Text>Exercise: {event.exercise || '-'}</Text>
        <Text>Relax: {event.relax || '-'}</Text>
      </View>
    );
  };


  const renderModal = () => {
    const event = data[selectedDate] || {};

    return (
      <Modal visible={modalVisible} animationType="slide">
        <View>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
          <Text>Date: {selectedDate}</Text> 
          <Text>Sleep: {event.sleep || '-'}</Text>
          <Text>Exercise: {event.exercise || '-'}</Text>
          <Text>Relax: {event.relax || '-'}</Text>
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

