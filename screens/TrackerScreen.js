import React, { useEffect, useState, useContext } from 'react'
import { Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker';
import { supabase } from '../lib/supabase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { UserContext } from '../lib/UserContext';


export default function TrackerScreen() {

  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  //const [total, setTotal] = useState("")
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState([])
  const [mood, setMood] = useState()
  const [notes, setNotes] = useState("")
  const { setIsLoggedIn, setSession, username, userID } = useContext(UserContext)


  //const activities = ["Sleep", "Exercise", "Relax"];

  useEffect(() => {
    async function fetchCategories() {
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


  async function fetchIdAndCategory(dailyId){
    if(dailyId !== undefined){
      try{
        let { data, error } = await supabase
          .from('category_track')
          .select("*")
          .eq('daily_id', dailyId )
          .eq('category_id', parseInt(activity) )
          console.log(dailyId)
          console.log(activity)
          console.log(data)
          ///return {id : data[0].id, daily_id: data[0].daily_id, minutes: data[0].minutes, notes: data[0].note, category: data[0].category}
          return data[0].id
        }
        catch (error) {
          console.log("fetchIdAndCategory error", error)
        }
    }else{
      return undefined
    }
    
    
  }

  async function insertCategoryTrack(idAndCategory = undefined, dailyId) {
    try {
      
      let hoursToMinutes = (parseInt(hours) || 0) * 60
      let totalMinutes = hoursToMinutes + (parseInt(minutes) || 0)

      const { data, error } = await supabase
        .from('category_track')
        .upsert([
          { id: idAndCategory, category_id: activity, minutes: totalMinutes, note: notes, daily_id: dailyId, user_id: userID }
        ])
        
    }
    catch (error){
      console.log("insertCategoryTrack error", error)
    }

  }

  async function fetchDailyId() {
    const modifiedDate = new Date(date)
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
        console.log(data)
        console.log(error)
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

  async function insertDailyTrack(dailyId) {
    try {
      let { data, error } = await supabase
        .from('daily_track')
        .upsert(([
          { id: dailyId, user_id: userID, mood: mood, date: date },
        ]))
        .select()
      console.log("insert happended here")
      console.log(data)

      if (data === []) {
        return undefined
      } else {
        return data[0].id
      }

      
    } catch (error) {
      console.log("error insertDailyTrack", error)
      return
    }
  }

  async function insertDailyAndCategory() {
    try{
      let dailyId = await fetchDailyId()
    if (dailyId === undefined) {
      console.log("Luodaan uusi")
      dailyId = await insertDailyTrack(dailyId)
      insertCategoryTrack(undefined, dailyId)
    } else {
      console.log("Päivitä dailytrack tässä")
      console.log(dailyId)
      const idAndCategory = await fetchIdAndCategory(dailyId )
      insertCategoryTrack(idAndCategory,dailyId)
    }
    
    } catch (error) {
      console.log("insertDailyAndCategory error", error)
    }
    
  }




  function consoleLog() {
    let hoursToMinutes = parseFloat(hours) * 60
    let totalMinutes = (hoursToMinutes + parseFloat(minutes))
    console.log(activity)
    console.log(minutes)
    console.log(hours)
    console.log(totalMinutes)
    console.log(date)
    console.log(mood)
    console.log(notes)
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




  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.activity}>
          <Text style={styles.selectionHeader}>Activity:</Text>
          <SelectDropdown
            data={category}
            defaultButtonText={"Select activity"}
            onSelect={(selectedItem, name) => {
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


          {activity == 4 ? <>
            <View style={styles.row}>
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
                <FontAwesome5 name="meh" size={60} color={mood === 3 ? "#000000" : "#ffe62a"} />
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
              <Pressable style={styles.button} onPress={() => insertDailyTrack()}>
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
            </View>

            <View style={styles.date}>
              <DatePicker date={date} setDate={setDate} />
            </View>
            <Text style={styles.selectionHeader}>Notes for {activity === 1 ? "Sleep" : ""}
              {activity === 2 ? "Exercise" : ""}
              {activity === 3 ? "Relax" : ""}
              {activity === 4 ? "Mood" : ""}
            </Text>
            <View style={styles.row}>

              <TextInput
                style={styles.inputNotes}
                value={notes}
                onChangeText={t => setNotes(t)}
                multiline
                placeholder='Some notes for sleep, exercise, relax or mood'
              />
            </View>
            <Pressable style={styles.button} onPress={() => insertDailyAndCategory()}>
              <Text>Save</Text>
            </Pressable>
          </>}

        </View>
      </KeyboardAvoidingView>
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
    color: "#152d33",
    fontSize: 20
  },
  // VEETIN CSS
  selectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  activity: {
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
    borderTopWidth: 1,
    borderLeftWidth: 1,
    fontSize: 20,
    color: "#6a4595",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 4,
  },
  inputMinutes: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    fontSize: 20,
    color: "#6a4595",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
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
  },
  inputNotes: {
    fontSize: 20,
    color: "#6a4595",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    width: 250,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
  },

  //
});      