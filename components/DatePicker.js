import DateTimePicker from '@react-native-community/datetimepicker';
import style from '../style/style';
import { Button, Text, View, StyleSheet } from 'react-native';
import React, { useState } from "react";
import { Pressable } from 'react-native';



export default function DatePicker({date, setDate}) {

    
    
    const [datePicker, setDatePicker] = useState(false);
 

    function showDatePicker() {
        setDatePicker(true);
    };

    function onDateSelected(event, value) {
        setDate(value);
        setDatePicker(false);
    };

    return (
        <View style={style.container}>

            <Text style={style.selectionHeader}>Date</Text>


            {datePicker && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={'default'}
                    is24Hour={true}
                    onChange={onDateSelected}
                    positiveButton={{textColor: 'green'}}
                    negativeButton={{textColor: 'red'}}
                />
            )}

            {!datePicker && (
                <View style={{ margin: 10, height: 60}}>
                    <Pressable 
                    style={style.calendar}
                    onPress={showDatePicker}
                    textColor="#000000"
                    
                    >
                    <Text>{date.toLocaleDateString()}</Text></Pressable>
                    {/*<Text>{date.toISOString()}</Text>*/}
                </View>
            )}
        </View>
    );
}