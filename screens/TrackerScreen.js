import React, { useEffect, useState, useContext, useRef } from 'react'
import { Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Alert, Modal, ScrollView, Button } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from '../components/DatePicker';
import { supabase } from '../lib/supabase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { UserContext } from '../lib/UserContext';
import { useIsFocused } from '@react-navigation/native';
import InfoCards from "../components/InfoCards"

export default function TrackerScreen({route, navigation}) {
  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  //const [total, setTotal] = useState("")
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState([])
  const [mood, setMood] = useState()
  const [notes, setNotes] = useState("")
  const { setIsLoggedIn, setSession, username, userID } = useContext(UserContext)
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef({});
  const isFocused = useIsFocused();
  const [pressed, setPressed] = useState(false);
  const pressIn = () => setPressed(true);
  const pressOut = () => setPressed(false);


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
  
  //  Resetoi kaiken, kun screeni aukaistaan
  useEffect(() => {
    console.log(route.params.homeScreenDate)

    dropdownRef.current.reset()
    setActivity("")
    setHours(null)
    setMinutes(null)
    setNotes("")
  }, [isFocused])
  
  
  useEffect(() => {
    
    if (category.length === 0 || route.params === undefined) {
      return
    }

    switch(route.params.homeScreenActivityId) {
      case 1:
        setActivity(1)
        dropdownRef.current.selectIndex(0)
        break;
      case 2:
        setActivity(2)
        dropdownRef.current.selectIndex(1)
        break;
      case 3:
        setActivity(3)
        dropdownRef.current.selectIndex(2)
        break;
    }

    setDate(route.params.homeScreenDate)

  }, [route.params, category])

  useEffect(() => {
    async function fetchData() {
      try {
        let dailyID = await fetchDailyId()
        console.log("dailyID Tässä", dailyID)

        let fetchItems = await fetchCategoryItems(dailyID, activity)
        console.log("FetchItems", fetchItems)

        if (fetchItems === undefined || fetchItems.length === 0) {
          setMinutes("")
          setHours("")
          setNotes("")
          return
        }

        if (fetchItems.length > 0) {
          let mins = (fetchItems[0].minutes % 60).toString()
          let hrs = parseInt(fetchItems[0].minutes / 60).toString()
          let notes1 = fetchItems[0].note
          let actv = parseInt(fetchItems[0].category_id)
          console.log("Mins", mins)
          console.log("hrs", hrs)
          console.log("notes", notes1)
          console.log("actv", actv)

          setMinutes(mins)
          setHours(hrs)
          setNotes(notes1)
          setActivity(actv)
        }
      } catch (error) {
        console.log("fetchData error", error);
      }
    }

    fetchData();
  }, [date, activity]);

  async function fetchCategoryItems(dailyId, activity) {
    if (dailyId !== undefined) {
      try {
        let { data, error } = await supabase
          .from('category_track')
          .select("*")
          .eq('daily_id', dailyId)
          .eq('category_id', parseInt(activity))
        if (error) {
          console.log("fetchCategoryItems supabase error", error)
        }

        return data
      }
      catch (error) {
        console.log("fetchCategoryItems error", error)
      }
    } else {
      return undefined
    }
  }

  async function fetchIdAndCategory(dailyId) {
    if (dailyId !== undefined) {
      try {
        let { data, error } = await supabase
          .from('category_track')
          .select("*")
          .eq('daily_id', dailyId)
          .eq('category_id', parseInt(activity))

        console.log("fetchIdAndCategory data", data)
        console.log("fetchIdAndCategory error", error)
        ///return {id : data[0].id, daily_id: data[0].daily_id, minutes: data[0].minutes, notes: data[0].note, category: data[0].category}
        return data[0].id
      }
      catch (error) {
        console.log("fetchIdAndCategory error", error)
      }
    } else {
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
    catch (error) {
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
      console.log("fetchDailyId data: ", data)
      console.log("fetchDailyId error: ", error)
      if (data[0].mood !== undefined) {
        setMood(data[0].mood)
      }
      else {
        setMood("")
      }
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
      console.log("insertDailyTrack error: ", error)

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

  async function updateMood() {
    let dailyId = await fetchDailyId()
    try {
      let { data, error } = await supabase
        .from('daily_track')
        .upsert(([
          { id: dailyId, user_id: userID, mood: mood, date: date },
        ]))
        .select()
      if (error) {
        console.log("updateMood error: ", error)
      }

      if (mood === undefined) {
        Alert.alert("No mood selected", "Select mood")
      }
      else {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000)
      }

    } catch (error) {
      console.log("error updateMood", error)
      return
    }
  }

  async function insertDailyAndCategory() {
    try {
      let dailyId = await fetchDailyId()
      if (dailyId === undefined) {
        console.log("Luodaan uusi")
        dailyId = await insertDailyTrack(dailyId)
        insertCategoryTrack(undefined, dailyId)
      } else {
        console.log("Päivitä dailytrack tässä")
        console.log(dailyId)
        const idAndCategory = await fetchIdAndCategory(dailyId)
        insertCategoryTrack(idAndCategory, dailyId)
      }
      if (activity === "") {
        Alert.alert("No activity selected", "Please select an activity.")
      }
      else if (minutes === "" && hours === "") {
        Alert.alert("Empty duration", "Please set duration.")
      }
      else {
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000)
      }

    } catch (error) {
      console.log("insertDailyAndCategory error", error)
    }

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
        alert("Maximum time for a task is 23 hours and 59 minutes")
      } else {
        setHours(hrs);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ width: "100%" }}>
          <View style={styles.activity}>
            <Text style={styles.selectionHeader}>Activity:</Text>
            <SelectDropdown
              style={styles.selectDropdown}
              data={category}
              ref={dropdownRef}
              buttonStyle={{backgroundColor: "#fafafa", width:250, fontSize: 20, borderColor: "#dedede",
              borderWidth: 2, shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,}}
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
              dropdownOverlayColor={"#DCC9B6"}
            />


            {activity == 4 ? <>
              <View style={styles.row}>
                <Text style={styles.selectionHeader}>Select mood:</Text>
              </View>
              <View style={styles.moodRow}>
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
                <Modal transparent={true} visible={showModal} animationType="fade">
                  <View>
                    <Text style={styles.modalText}>Data saved</Text>
                  </View>
                </Modal>
              </View>
              <View style={styles.date}>
                <DatePicker date={date} setDate={setDate} fetchDailyId={fetchDailyId} kissa="koira" activity={"isask"} setMinutes={setMinutes} setHours={setHours} setNotes={setNotes} />
              </View>
              <View>
                <Pressable style={[styles.button, pressed && styles.buttonPressed]}
                  onPressIn={pressIn}
                  onPressOut={pressOut} onPress={() => updateMood()} >
                  <Text style={styles.buttonText}>SAVE</Text>
                </Pressable>
              </View></> : <><View style={styles.durationView}>
                <Text style={styles.selectionHeader}>Duration:</Text>

                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={styles.inputHours}
                    onChangeText={text => sanitazedHours(text)}
                    value={hours}
                    maxLength={2}
                    keyboardType="numeric"
                    placeholder='hours'
                  />
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
                <Text style={styles.selectionHeader}>Date:</Text>
                <DatePicker date={date} setDate={setDate} />
              </View>
              <Text style={styles.selectionHeader}>Notes for {activity === 1 ? "Sleep:" : ""}
                {activity === 2 ? "Exercise:" : ""}
                {activity === 3 ? "Relax:" : ""}
                {activity === 4 ? "Mood:" : ""}
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
              <Pressable style={[styles.button, pressed && styles.buttonPressed]}
                  onPressIn={pressIn}
                  onPressOut={pressOut} onPress={() => insertDailyAndCategory()}>
                <Text style={styles.buttonText}>SAVE</Text>
              </Pressable>
              <Modal transparent={true} visible={showModal} animationType="fade">
                <View>
                  <Text style={styles.modalText}>Data saved</Text>
                </View>
              </Modal>
            </>}
          </View>
        </ScrollView>
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
    padding: 7,
    backgroundColor: "#498467",
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#317554",
    borderWidth: 2,
  },
  buttonPressed: {
    backgroundColor: '#317052',
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  // VEETIN CSS
  selectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center"
  },
  selectDropdown: {

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
  moodRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 100,
  },
  inputWrap: {
    borderColor: "#cccccc",
  },
  durationView: {
    padding: 13
  },
  inputHours: {
    width: 115,
    fontSize: 20,
    color: "#000000",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    padding: 5,
    paddingLeft: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#dedede",
    borderWidth: 2,
  },
  inputMinutes: {
    width: 115,
    fontSize: 20,
    color: "#000000",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    padding: 5,
    paddingRight: 10,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#dedede",
    borderWidth: 2,
  },
  calendar: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fafafa",
    width: 200,
    alignItems: "center",

  },
  date: {
    flex: 1,
    alignItems: "center",
  },
  inputNotes: {
    fontSize: 20,
    color: "#000000",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    width: 250,
    minHeight: 100,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#dedede",
    borderWidth: 2,
  },

  modalText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: "#ffffff",
    padding: 17,
  },
  save: {
    margin: 100,
    alignSelf: "flex-end"
  },

  //
});      