import DateTimePicker from '@react-native-community/datetimepicker';
import style from '../style/style';
import { Button, Text, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from "react";
import { Pressable } from 'react-native';
import { supabase } from '../lib/supabase';



export default function DatePicker({ date, setDate, activity, kissa, setMinutes, setHours, setNotes }) {

    useEffect(() => {
      console.log(kissa)
    
    }, [kissa])
    

    async function fetchDailyId(value) {
        const modifiedDate = new Date(value)
        const year = modifiedDate.getFullYear();
        const month = modifiedDate.getMonth() + 1;
        const day = modifiedDate.getDate();
        const wholeDate = `${year}-${month}-${day}`
        console.log(wholeDate)
        try {
            let { data, error } = await supabase
                .from('daily_track')
                .select("*")
                .eq('date', wholeDate)
            console.log("fetchDailyId data: ", data)
            console.log("fetchDailyId error: ", error)
            if (data.length === 0) {
                return undefined
            } else {
                return data[0].id
            }
        } catch (error) {
            console.log("fetchDailyId error", error)
            return undefined
        }

    }

    {/*async function updateFrontendData(value) {
        console.log("TrackerScreen log")
        let dailyId = await fetchDailyId(value)
        console.log(dailyId)
        console.log(activity)
        try {
            let { data, error } = await supabase
                .from('category_track')
                .select("*")
                .eq('daily_id', dailyId)
                .eq('category_id', parseInt(activity))
                
            let mins = ''
            let hrs = ''
            let notes = ''

            if (data && data.length > 0) {
                mins = (data[0].minutes % 60).toString()
                hrs = parseInt(data[0].minutes / 60)
                notes = data[0].note
            }
            setMinutes(mins)
            setHours(hrs)
            setNotes(notes)
            
        }
        catch (error) {
            console.log("updateFrontendData error", error)
        }
    }*/}



    const [datePicker, setDatePicker] = useState(false);


    function showDatePicker() {
        setDatePicker(true);
    };

    async function onDateSelected(event, value) {
        setDate(value);
        setDatePicker(false);
        console.log("DatePicker Log")
    };

    return (
        <View style={style.container}>



            {datePicker && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={'default'}
                    is24Hour={true}
                    onChange={onDateSelected}
                    positiveButton={{ textColor: 'green' }}
                    negativeButton={{ textColor: 'red' }}
                />
            )}

            {!datePicker && (
                <View style={{ margin: 10, height: 60 }}>
                    <Pressable
                        style={style.calendar}
                        onPress={showDatePicker}
                        textColor="#000000"

                    >
                        <Text style={{fontSize: 20}}>{date.toLocaleDateString()}</Text></Pressable>
                </View>
            )}
        </View>
    );
}