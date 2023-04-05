import DateTimePicker from '@react-native-community/datetimepicker';
import style from '../style/style';
import { Button, Text, View } from 'react-native';
import React, { useState } from "react";



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

            <Text>Date = {date.toISOString()}</Text>


            {datePicker && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={'default'}
                    is24Hour={true}
                    onChange={onDateSelected}
                />
            )}

            {!datePicker && (
                <View style={{ margin: 10 }}>
                    <Button title="Show Date Picker" color="green" onPress={showDatePicker} />
                    <Text>{date.toISOString()}</Text>
                </View>
            )}
        </View>
    );
}