import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker';
import { supabase } from '../lib/supabase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function TrackerScreen() {

  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  //const [total, setTotal] = useState("")
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState([])
  const [mood, setMood] = useState()

  //const activities = ["Sleep", "Exercise", "Relax"];

  useEffect(() => {
    async function fetchCategories(){
      let { data: category, error } = await supabase
      .from('category')
      .select('*')

      if (error) {
        console.log("error", error)
      } else {
        const moodObject = {
          name: 'Mood',
          id: 4
        };
        category.push(moodObject)
        setCategory(category)
      }
    }
    console.log("Avattu")
    fetchCategories()
  }, [])

  useEffect(() => {
    console.log(category)
  }, [category])

/*  useEffect(() => {
    async function insertCategories(){
      let hoursToMinutes = parseFloat(hours) * 60
      let totalMinutes = (hoursToMinutes + parseFloat(minutes))
      let { data: category, error } = await supabase
      .from('category_track')
      .insert(([
        { category_id: activity, minutes: totalMinutes,  },
      ]))

      if (error) {
        console.log("error", error)
      } else {
        setCategory(category)
      }
    }
    console.log("Avattu")
    insertCategories()
  }, [])

  useEffect(() => {
    console.log(category)
  }, [category])  */
  


  function consoleLog() {
    let hoursToMinutes = parseFloat(hours) * 60
    let totalMinutes = (hoursToMinutes + parseFloat(minutes))
    console.log(activity)
    console.log(minutes)
    console.log(hours)
    console.log(totalMinutes)
    console.log(date)
    console.log(mood)
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

  useEffect(() => {
    console.log(mood)
  }, [mood])
  

  return (
    <View style={styles.container}>
      <View style={styles.activity}>
      <Text style={styles.selectionHeader}>Activity:</Text>
        <SelectDropdown
          data={category}
          defaultButtonText={"Select activity"}
          onSelect={(selectedItem, name) => {
            console.log('selected name ->>>>',selectedItem.name)
            console.log('selected Id ->>>>',selectedItem.id)
            setActivity(selectedItem.id)
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem.name
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item.name
        }}
          dropdownOverlayColor={"#9c6363"}
        />
        {activity == 4 ? <><View style={styles.row}>
        <Pressable 
        onPress={() => setMood(1)}
        >
        <FontAwesome5 name="dizzy" size={60} color={mood === 1 ? "#000000" : "#ffe62a"} />
        </Pressable>
        <Pressable
        onPress={() => setMood(2)}
        >
        <FontAwesome5 name="frown" size={60} color={mood === 2 ? "#000000" : "#ffe62a"} />
        </Pressable>
        <Pressable
        onPress={() => setMood(3)}
        >
        <FontAwesome5 name="meh" size={60} color={mood === 3 ? "#000000" : "#ffe62a"}/>
        </Pressable>
        <Pressable
        onPress={() => setMood(4)}
        >
        <FontAwesome5 name="smile" size={60} color={mood === 4 ? "#000000" : "#ffe62a"} />
        </Pressable>
        <Pressable
        onPress={() => setMood(5)}
        >
        <FontAwesome5 name="smile-beam" size={60} color={mood === 5 ? "#000000" : "#ffe62a"} />
        </Pressable>
        </View> 
        <View style={styles.date}>
        <DatePicker date={date} setDate={setDate} />
      <Pressable style={styles.button} onPress={consoleLog}>
        <Text>Save</Text>
      </Pressable>
    </View></> : <><View style={styles.row}>
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
      </View><View style={styles.date}>
        <DatePicker date={date} setDate={setDate} />
      <Pressable style={styles.button} onPress={consoleLog}>
        <Text>Save</Text>
      </Pressable>
    </View></>}
      </View>
      
      
    </View>
  )
}

   

const styles = StyleSheet.create({   
    
    container: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DCC9B6',
    },

    header: {

        marginTop: 30,
        marginBottom: 15,
        flexDirection: 'row',

    },  

    footer: {
        marginTop: 20,
        backgroundColor: 'skyblue',
        flexDirection: 'row'
      },

      row: {
        marginTop: 20,
        padding: 10
      },
      flex: {
        flexDirection: "row"
      },
      button: {
        margin: 30,
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#75d9af",
        width: 150,
        borderRadius: 15, 
        justifyContent: 'center',
        alignItems: 'center'
      },
      buttonText: {
        color:"#152d33",
        fontSize: 20
      },
      // VEETIN CSS
      selectionHeader:{
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
      },
      activity:{
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
      },
      row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      inputWrap: {
        borderColor: "#cccccc",
      },
      inputHours: {
        borderBottomWidth: 1,
        borderTopWidth:1,
        borderLeftWidth:1,
        fontSize: 20,
        color: "#6a4595",
        justifyContent: "center",
        alignItems: "center",
        textAlign:"center",
        backgroundColor:"#fafafa",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 4,
      },
      inputMinutes: {
        borderBottomWidth: 1,
        borderTopWidth:1,
        borderRightWidth:1,
        fontSize: 20,
        color: "#6a4595",
        justifyContent: "center",
        alignItems: "center",
        textAlign:"center",
        backgroundColor:"#fafafa",
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        padding: 4,
      },
      calendar: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fafafa",
        width: 200,
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5,
      },
      date: {
        flex: 1,
      }
      //
});      