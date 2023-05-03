import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable, Alert, Modal, ScrollView, TextInput } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import {  Button } from "react-native-paper";
import { useEffect, useState, useContext } from 'react'
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import DatePicker from '../components/DatePicker';

import { UserContext } from '../lib/UserContext';







export default function BadHabitScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [habitID, setHabitID] = useState(null);
  const [data, setData] = useState([])
  const [showNotif, setShowNotif] = useState(false)
  const [notifText, setNotifText] = useState("Data saved")
  
  const { setIsLoggedIn, setSession, username, userID } = useContext(UserContext)

function showNotification() {
  setShowNotif(true);
  setTimeout(() => setShowNotif(false), 2000)
}

async function addHabit(title, newDate, userID, dataArray, setData){

  try {
      let { data: inserted, error } = await supabase
      .from('bad_habits')
      .insert([
        { start_date: newDate, title: title, user_id: userID}
      ])

      let { data: id, error2 } = await supabase
      .from('bad_habits')
      .select('id')
      .order("id", {ascending: false})
      .limit(1)

      let id1 = id[0].id
      let date1 = newDate.toISOString()
    
    const habitObject = {
      title: title,
      start_date: date1,
      id: id1,
      favorite: false
    }

    dataArray.push(habitObject)
    dataArray.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    setData([...dataArray])
    setNotifText('Habit "'+ title + '" added')
    showNotification()

  } catch (error) {
    setNotifText("Error adding habit")
    showNotification()
  }

}

async function delHabit(habitID, title, dataArray, setData){

  try {
    const { data, error } = await supabase
    .from('bad_habits')
    .delete()
    .eq('id', habitID)

    setNotifText('Habit "' + title + '" deleted')
      showNotification() 

    for (let i = 0; i < dataArray.length; i++) {

      if (dataArray[i].id == habitID) {
        let habitIndex = dataArray.indexOf(dataArray[i])
        dataArray.splice(habitIndex,1)
        setData([...dataArray])
      }
    }
  } catch (error) {
    setNotifText("Error deleting habit")
      showNotification()
  }
}

async function editHabit(title, date, habitID, oldName, oldDate, dataArray, setData){

  let oldDateString = String(oldDate)
  let dateString = String(date)

  //name and date are same as old data. So nothing changed
   if (title == oldName && dateString == oldDateString) {
    setNotifText("Nothing was changed")
    showNotification()
  } 
  //name is same as old, date is different so update date
  else if (title == oldName && dateString !== oldDateString) {
    const { data, error } = await supabase
    .from('bad_habits')
    .update({ start_date: date })
    .eq("id", habitID)
    if (error) {
      setNotifText("Error updating date")
      showNotification()
    } else {
      setNotifText("Date updated")
      showNotification()
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == habitID) {
          let habit = dataArray[i]
          habit.start_date = date
          dataArray.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          setData([...dataArray])
        }
      }
    }
  } 
  //name changed, date old data, so just update name
  else if ( title !== oldName && dateString == oldDateString ) {
    const { data, error } = await supabase
    .from('bad_habits')
    .update({ title: title})
    .eq("id", habitID)
    if (error) {
      setNotifText("Error updating name")
      showNotification()
    } else {
      setNotifText("Name updated")
      showNotification()
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == habitID) {
          let habit = dataArray[i]
          habit.title = title 
          setData([...dataArray])
        }
      }
    }
  } 
  // update both
  else {
    const { data, error } = await supabase
    .from('bad_habits')
    .update({ start_date: date, title: title})
    .eq("id", habitID)
    if (error) {
      setNotifText("Error updating data")
      showNotification()
    } else {
      setNotifText("Date and name updated")
      showNotification()
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == habitID) {
          let habit = dataArray[i]
          habit.title = title 
          habit.start_date = date
          dataArray.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          setData([...dataArray])
        }
      }
    }
  }
}

async function setFavourite(id, favorite, dataArray) {

  //change true to false

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].id == id) {
        habit = dataArray[i]
        if (habit.favorite == true) {
          const { data2, error2 } = await supabase
            .from('bad_habits')
            .update({ favorite: false })
            .eq('id', id)

          if (error2) {
            setNotifText("Error removing from favorites")
            showNotification()
          } else {
            for (let i = 0; i < dataArray.length; i++) {
              if (dataArray[i].id == id) {
                let habit = dataArray[i]
                habit.favorite = false 
                setData([...dataArray])
              }
            }
          }
        } else if (habit.favorite == false) {
          const { data, error } = await supabase
            .from('bad_habits')
            .update({ favorite: true })
            .eq('id', id)

          if (error) {
            setNotifText("Error adding to favorites")
            showNotification()
          } else {
            for (let i = 0; i < dataArray.length; i++) {
              if (dataArray[i].id == id) {
                let habit = dataArray[i]
                habit.favorite = true 
                setData([...dataArray])
              }
            }
          }
        }
    }
  }
}



  useEffect(() => {
    //function to fetch all bad habits from database
    async function getData() {
  
      let { data: bad_habits, error } = await supabase
        .from('bad_habits')
        .select('*')
        .order('start_date')
    
        if (error) {
          Alert.alert('Error getting data')
        } else {
          setData(bad_habits)
        }
    } 
    //run said function
    getData()

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]}
        onPress={()=>setModalVisible(true)}>
        <Text style={styles.heading}>Add new habit                       <AntDesign name="pluscircle" size={24} color="black" style={{justifyContent:"flex-end"}}/></Text>
      </Pressable>
      <View style={styles.row}>
        <View>
          <Text style={styles.heading}>Time since bad habits: </Text>
        </View>
      </View>
      <ScrollView>
      {
				data.map((item) => {
					return (
						<Card key={item.id} id={item.id} name={item.title} date={item.start_date} setData={setData} setFavourite={setFavourite} dataArray={data} favorite={item.favorite} editMode={editMode} setEditMode={setEditMode} modalVisible={modalVisible} setModalVisible={setModalVisible} setModalDate={setModalDate} setModalName={setModalName} setHabitID={setHabitID} habitID={habitID}/>
					)
				})
			}
      </ScrollView>
      {modalVisible && <Form dataArray={data} delHabit={delHabit}editHabit={editHabit} setHabitID={setHabitID} habitID={habitID} setData={setData} userID={userID} addHabit={addHabit} editMode={editMode} setEditMode={setEditMode} setModalVisible={setModalVisible} modalVisible={modalVisible} oldName={modalName} oldDate={modalDate} setModalDate={setModalDate} setModalName={setModalName}/>}
      <Modal transparent={true} visible={showNotif} animationType="fade">
          <View>
            <Text style={styles.notifText}>{notifText}</Text>
          </View>
        </Modal>
    </SafeAreaView>
  )
}

const Form = ({delHabit, setModalVisible, modalVisible, oldName, oldDate, setModalDate, setModalName, editMode, setEditMode, addHabit, userID, dataArray, setData, habitID, setHabitID, editHabit}) => {
  oldDate = new Date(oldDate)

  const [newName, setNewName] = useState(oldName)
  const [date, setDate] = useState(oldDate);
  const [newDate, setNewDate] = useState(new Date());

  tz = Number( (new Date().getTimezoneOffset() * -1) / 60 )

  function closeForm() {
    setModalName("");
    setModalDate("");
    setNewName("")
    setEditMode(false)
    setHabitID(null)
    setDate(new Date())
    setModalVisible(false)
  }

  if (oldName == null || oldName == "") {
    oldName = "Name"
  }

  function alertConfirmation() {
    //function to make two option alert
    string = String('Are you sure you want to delete "' + oldName + '" ?' )

    Alert.alert(
      string ,
      "Your data will be lost",
      [
        {text: 'Yes', onPress: () => {delHabit(habitID, newName, dataArray, setData), closeForm()}},
        {text: 'No', onPress: () => null},
      ],
      { cancelable: false }
    );
  }

  if (editMode==true) {

    dateClean = date.setHours(tz, 0, 0, 0)
    dateClean = new Date(dateClean)
   
    return (
     
        <Modal
          statusBarTranslucent={false}
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          //close form without changing anything
          onRequestClose={() => {
            closeForm()
          }}>
          <View style={{flex:1, flexDirection:"column-reverse"}}>
          <View style={styles.modalContainer}>
              <View style={{flexDirection:"row"}}>
                  <Text style={styles.modalHeading}>Edit: "{oldName}"</Text> 
                  <Pressable
                 //delete habit
                  style={{flex:0.1, justifyContent:"center"}}
                  onPress={() => {
                    alertConfirmation();
                  }}>
                  <Text style={{textAlign:"center"}}><FontAwesome name="trash-o" size={20} color="#C44536"/></Text>
                </Pressable>
              </View>
              <TextInput style={styles.textInput} value={newName} onChangeText={t=>setNewName(t)}></TextInput>
              <DatePicker badHabit={true} date={date} setDate={setDate}/>
                <View style={{ flexDirection:"row", flex:0.33}}>                
                  <Pressable
                //close form without changing anything / part 2
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    closeForm()
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                  style={[styles.button, styles.buttonSave]}
                  //save form data, send edited info
                  onPress={() => {
                    if (dateClean> new Date()) {
                      Alert.alert("You can't select a date from the future")
                    } else if (newName=="") {
                      Alert.alert("Please input a name for your habit")
                    } else {
                      setDate(new Date(date.setHours(tz,0,0,0)))
                      editHabit(newName, date, habitID, oldName, oldDate, dataArray, setData)
                      closeForm()
                    }
                  }}>
                  <Text style={styles.buttonText}>Update</Text>
                  </Pressable>
                </View>
            </View>
          </View>
   
        </Modal>
    
    )
    
  } else {
    //ADD NEW HABIT
    return (
      <Modal
          statusBarTranslucent={false}
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          //close form without changing anything
          onRequestClose={() => {
            closeForm()
          }}>
          <View style={{flex:1, flexDirection:"column-reverse"}}>
          <View style={styles.modalContainer}>
              <View style={{flexDirection:"row"}}>
                  <Text style={styles.modalHeading}>Add new habit</Text> 
              </View>
              <TextInput style={styles.textInput} placeholder="Habit name" onChangeText={t=>setNewName(t)}></TextInput>
              <DatePicker badHabit={true} date={newDate} setDate={setNewDate}/>
                <View style={{ flexDirection:"row", flex:0.33}}>                
                  <Pressable
                //close form without changing anything / part 2
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    closeForm()
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                  style={[styles.button, styles.buttonSave]}
                  //save form data, send edited info
                  onPress={() => {
                    if (date> new Date() || newDate> new Date()) {
                      Alert.alert("You can't select a date from the future")
                    } else if (newName=="") {
                      Alert.alert("Please input a name for your habit")
                    } else {
                    addHabit(newName, newDate, userID, dataArray, setData)
                    closeForm()
                    }
                  }}>
                  <Text style={styles.buttonText}>Save</Text>
                  </Pressable>
                </View>
            </View>
          </View>
   
        </Modal>
        )
  }
}
//card component (one habit)
const Card = ({id,name, date, favorite, setFavourite, setModalVisible, setModalName, setModalDate, setHabitID, habitID, dataArray, editMode={editMode}, setEditMode={setEditMode}, setData}) => {

  function countUp(countFrom) {

    const [time, setTime] = useState(new Date());

    useFocusEffect(
      React.useCallback(() => {
        const interval = setInterval(() => {
          setTime(new Date());
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      }, [])
    );

    countFrom = new Date(countFrom)

    var now = new Date(),
        countFrom = new Date(countFrom),
        timeDifference = (now - countFrom);
      
    var secondsInADay = 60 * 60 * 1000 * 24,
        secondsInAHour = 60 * 60 * 1000;
      
    days = Math.floor(timeDifference / (secondsInADay) * 1);
    hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
    minutes = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
    seconds = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);

    return (
      <Text>{days}d {hours}h {minutes}m {seconds}s</Text>
    )
  }

return (
  <Pressable
    style={({ pressed }) => [styles.card, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]} 
    onPress={()=> {
      setEditMode(true)
      setModalVisible(true)
      setModalName(name)
      setModalDate(date)
      setHabitID(id)
    }}
  >
    <View style={{flex:1, flexDirection:"column"}}>
      <Text style={{textAlign: "left", fontWeight:"bold", fontSize: 16}}>{name}</Text>
      <Text style={{textAlign: "center", fontSize: 16}}>{countUp(date)}</Text> 
      { favorite &&
      
        <Text style={{textAlign: "right"}}>
          <Pressable hitSlop={25} onPress={()=> 
      setFavourite(id,favorite, dataArray, habitID, setData)} ><FontAwesome name="star" size={24} color="black"  /></Pressable>
        </Text>
       }
      { favorite==false &&
       <Text style={{textAlign: "right"}}>
       <Pressable hitSlop={25} onPress={()=> 
     setFavourite(id,favorite, dataArray, habitID, setData)} ><FontAwesome name="star-o" size={24} color="black" /></Pressable>
     </Text>}
    </View>
  </Pressable>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCC9B6"
  },
  pressable: {
   backgroundColor: "#FFEDD7"
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    backgroundColor: "#FFEDD7"
  },
  textAlign: {
    textAlign: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight:"bold"
  },
  modalHeading: {
    textAlign: "left",
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
    flex:0.9,
  },
  button: {
    padding: 10,
    borderTopWidth:1,
  },
  buttonClose:{
   flex:1,
   backgroundColor:"#C44536"
  },
  buttonSave:{
    flex:1,
    backgroundColor:"#498467"
  },
  buttonText: {
    textAlign: 'center',
    color: "#fff",
    fontWeight:"bold"

  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    flex:1,
    padding: 20,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    marginBottom:12,
    backgroundColor: "#FFEDD7",
    /* ------------------------- */ 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 0.33, 
    marginLeft:10,
    marginRight:10,
    backgroundColor:"#FFEDD7",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
    borderWidth:1,
    overflow:"hidden"
  },
  textInput: {
    backgroundColor:"white",
    padding: 10,
    textAlign:"center"
  },
  notifText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: "#ffffff",
    padding: 17,
  }
});
