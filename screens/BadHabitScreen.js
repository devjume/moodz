import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable, Alert, Modal, ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { TextInput, Button } from "react-native-paper";
import { useEffect, useState, useContext } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import DatePicker from '../components/DatePicker';
import { UserContext } from '../lib/UserContext';

async function getData({setData}) {
  let { data: bad_habits, error } = await supabase
    .from('bad_habits')
    .select('*')

    if (error) {
			console.log("error", error)
		} else {
			setData(bad_habits)
		}
} 

async function addHabit(title, date, userID, dataArray, setData){


  const { data, error } = await supabase
  .from('bad_habits')
  .insert([
    { start_date: date, title: title, user_id: userID}
  ])

  if (error) {
    console.log("error", error)
  } else {
    console.log("data ines")
    let date1 = date.toISOString()
    
    const habitObject = {
      title: title,
      start_date: date1
    }

    //dataArray.push(habitObject)
    //setData(dataArray)
    //console.log(dataArray)
    Alert.alert('Habit "'+ title + '" added')
    
  }

}

async function delHabit(habitID, title){

  const { data, error } = await supabase
  .from('bad_habits')
  .delete()
  .eq('id', habitID)
  if (error) {
    Alert.alert("Error deleting Habit", error)
  } else {
    Alert.alert('Habit "'+ title + '" deleted')
  }
}

async function editHabit(title, date, habitID, oldName, oldDate){
  
  // editing habit works partially, date is always saved even if it doesn't change. Name won't be updated if name is same. Nii että juu

  if (title == oldName) {
    console.log("sama nimi")
    const { data, error } = await supabase
    .from('bad_habits')
    .update({ start_date: date })
    .eq("id", habitID)
  } else {
    console.log("eri nimi")
    const { data, error } = await supabase
    .from('bad_habits')
    .update({ start_date: date, title: title})
    .eq("id", habitID)
  }

  Alert.alert('Jipii muutoksia koska en oo konservatiivinen')

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
    
    getData({setData});

  }, [])
  
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]}
        onPress={()=>setModalVisible(true)}>
        <Text style={styles.heading}>Add new habit.                <AntDesign name="pluscircle" size={24} color="black" style={{justifyContent:"flex-end"}}/></Text>
      </Pressable>
      <View style={[styles.row, {}]}>
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

  const [newName, setNewName] = useState(oldName)
  const [date, setDate] = useState(new Date());

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
                <TextInput placeholder={oldName} onChangeText={t=>setNewName(t)}></TextInput>
                <DatePicker date={date} setDate={setDate}/>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  //save form data, send edited info
                  onPress={() => {
                    if (date> new Date()) {
                      Alert.alert("You can't select a date from the future")
                    } else {
                      editHabit(newName, date, habitID, oldName, oldDate)
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
                    delHabit(habitID, newName)
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
                <TextInput placeholder={oldName} onChangeText={t=>setNewName(t)}></TextInput>
                <DatePicker date={date} setDate={setDate}/>
                {/* SAVE */}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    if (date> new Date()) {
                      Alert.alert("You can't select a date from the future")
                    } else {
                    addHabit(newName, date, userID, dataArray, setData)
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
    fontSize: 24
  },
  centeredView: {
    flex: 1,
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
    textDecorationLine: "underline"
  },
  card: {
    flex:1,
    borderWidth: 1,
    padding: 20,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "#FFEDD7"
  }
});
