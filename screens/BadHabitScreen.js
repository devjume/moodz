import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable, Alert, Modal, ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { TextInput, Button } from "react-native-paper";
import { useEffect, useState, useContext } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import DatePicker from '../components/DatePicker';
import { UserContext } from '../lib/UserContext';



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
      id: id1
    }

    dataArray.push(habitObject)
    setData([...dataArray])
    Alert.alert('Habit "'+ title + '" added')

  } catch (error) {
    Alert.alert('Error adding habit')
  }

}

async function delHabit(habitID, title, dataArray, setData){

  try {
    const { data, error } = await supabase
    .from('bad_habits')
    .delete()
    .eq('id', habitID)

    Alert.alert('Habit "'+ title + '" deleted') 

    for (let i = 0; i < dataArray.length; i++) {

      if (dataArray[i].id == habitID) {
        let habitIndex = dataArray.indexOf(dataArray[i])
        dataArray.splice(habitIndex,1)
        setData([...dataArray])
      }
    }
  } catch (error) {
    Alert.alert("Error deleting Habit", error)
  }
}

async function editHabit(title, date, habitID, oldName, oldDate, dataArray, setData){
  
  let oldDateString = String(oldDate)
  let dateString = String(date)

  //name and date are same as old data. So nothing changed
   if (title == oldName && dateString == oldDateString) {
    Alert.alert('Nothing was changed')
  } 
  //name is same as old, date is different so update date
  else if (title == oldName && dateString !== oldDateString) {
    const { data, error } = await supabase
    .from('bad_habits')
    .update({ start_date: date })
    .eq("id", habitID)
    if (error) {
      Alert.alert("Error updating date", error)
    } else {
      Alert.alert('Date updated')
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == habitID) {
          let habit = dataArray[i]
          habit.start_date = date
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
      Alert.alert("Error updating name", error)
    } else {
      Alert.alert('Name updated')
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
      Alert.alert("Error updating data", error)
    } else {
      Alert.alert('Date and name updated')
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == habitID) {
          let habit = dataArray[i]
          habit.title = title 
          habit.start_date = date
          setData([...dataArray])
        }
      }
    }
  }
}

export default function BadHabitScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [habitID, setHabitID] = useState(null);
  const [data, setData] = useState([])
  
  const { setIsLoggedIn, setSession, username, userID } = useContext(UserContext)
  
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

    console.log("infit")

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]}
        onPress={()=>setModalVisible(true)}>
        <Text style={styles.heading}>Add new habit                  <AntDesign name="pluscircle" size={24} color="black" style={{justifyContent:"flex-end"}}/></Text>
      </Pressable>
      <View style={[styles.row, {marginBottom:12}]}>
        <View>
          <Text style={styles.heading}>Time since bad habits: </Text>
        </View>
      </View>
      <ScrollView>
      {
				data.map((item) => {
					return (
						<Card key={item.id} id={item.id} name={item.title} date={item.start_date} favorite={item.favorite} editMode={editMode} setEditMode={setEditMode} modalVisible={modalVisible} setModalVisible={setModalVisible} setModalDate={setModalDate} setModalName={setModalName} setHabitID={setHabitID}/>
					)
				})
			}
      </ScrollView>
      {modalVisible && <Form dataArray={data} delHabit={delHabit}editHabit={editHabit} setHabitID={setHabitID} habitID={habitID} setData={setData} userID={userID} addHabit={addHabit} editMode={editMode} setEditMode={setEditMode} setModalVisible={setModalVisible} modalVisible={modalVisible} oldName={modalName} oldDate={modalDate} setModalDate={setModalDate} setModalName={setModalName}/>}
    </SafeAreaView>
  )
}

const Form = ({delHabit, setModalVisible, modalVisible, oldName, oldDate, setModalDate, setModalName, editMode, setEditMode, addHabit, userID, dataArray, setData, habitID, setHabitID, editHabit}) => {

  oldDate = new Date(oldDate)

  const [newName, setNewName] = useState(oldName)
  const [date, setDate] = useState(oldDate);
  const [newDate, setNewDate] = useState(new Date());
  

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

  if (editMode==true) {
    //EDIT EXISTING HABIT
    return (
      <View style={styles.centeredView}>
          <Modal
            statusBarTranslucent={false}
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            //close form without changing anything
            onRequestClose={() => {
              closeForm()
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Edit {oldName} habitID: {habitID}</Text>
                <TextInput defaultValue={oldName} onChangeText={t=>setNewName(t)}></TextInput>
                <DatePicker date={date} setDate={setDate}/>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  //save form data, send edited info
                  onPress={() => {
                    if (date> new Date()) {
                      Alert.alert("You can't select a date from the future")
                    } else if (newName=="") {
                      Alert.alert("Please input a name for your habit")
                    } else {
                      editHabit(newName, date, habitID, oldName, oldDate, dataArray, setData)
                      closeForm()
                    }
                  }}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
                <Pressable
                //close form without changing anything / part 2
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    closeForm()
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                //delete habit
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    delHabit(habitID, newName, dataArray, setData)
                    closeForm()
                  }}>
                  <Text style={styles.textStyle}>poista pahe ja ala narkkaan tai röökään tai mitä vaa</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        )

  } else {
    //ADD NEW HABIT
    return (
      <View style={styles.centeredView}>
          <Modal
            statusBarTranslucent={false}
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              closeForm()
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Add new habit</Text>
                <TextInput placeholder="Habit name" onChangeText={t=>setNewName(t)}></TextInput>
                <DatePicker date={newDate} setDate={setNewDate}/>
                {/* SAVE */}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    if (date> new Date()) {
                      Alert.alert("You can't select a date from the future")
                    } else {
                    addHabit(newName, newDate, userID, dataArray, setData)
                    closeForm()
                    }
                  }}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
                {/* CANCEL */}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    closeForm()
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        )
  }
}
//card component (one habit)
const Card = ({id,name, date, favorite, modalVisible, setModalVisible, setModalName, setModalDate, setHabitID, editMode={editMode}, setEditMode={setEditMode}}) => {

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
    <View>
      <Text style={{textAlign: "left", fontWeight:"bold", fontSize: 16}}>{name}</Text>
      <Text style={{textAlign: "center", fontSize: 16}}>{countUp(date)}</Text>
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
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    paddingTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  }
});
