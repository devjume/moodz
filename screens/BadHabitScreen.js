import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable, Alert, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';

import { fonts } from 'react-native-elements/dist/config';

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


export default function BadHabitScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [data, setData] = useState([])

  useEffect(() => {
    
    getData({setData});


    

  }, [])
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]}
        onPress={()=>setModalVisible(true)}>
        <Text style={styles.heading}>Add new habit.                        <AntDesign name="pluscircle" size={24} color="black" /></Text>
      </Pressable>
      <View style={[styles.row, {}]}>
        <View style={styles.card}>
          <Text style={styles.heading}>Time since bad habits:</Text>
        </View>
      </View>

      {
				data.map((item) => {
					return (
						<Card key={item.id} name={item.title} date={item.start_date} favorite={item.favorite} editMode={editMode} setEditMode={setEditMode} modalVisible={modalVisible} setModalVisible={setModalVisible} setModalDate={setModalDate} setModalName={setModalName}/>
					)
				})
			}

      {modalVisible && <Form editMode={editMode} setEditMode={setEditMode} setModalVisible={setModalVisible} modalVisible={modalVisible} oldName={modalName} oldDate={modalDate} setModalDate={setModalDate} setModalName={setModalName}/>}

    </SafeAreaView>
  )
}

const Form = ({setModalVisible, modalVisible, oldName, oldDate, setModalDate, setModalName, editMode, setEditMode}) => {

  const [newName, setNewName] = useState("")

  if (oldName == null || oldName == "") {
    oldName = "Name"
  }

  if (editMode==true) {
    
    return (
      <View style={styles.centeredView}>
          <Modal
            statusBarTranslucent={false}
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              setModalName("");
              setModalDate("");
              setNewName("");
              setEditMode(!editMode)
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Edit {oldName}</Text>
                <TextInput placeholder={oldName} onChangeText={t=>setNewName(t)}></TextInput>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    //en vielä tiiä miten supabase toimii, kuitenkin, tässä eka tulisi setata Modalname newNameksi, jonka jälkeen se viedään databaseen ja tyhjennetään kentät
                    console.log({newName})
                    setModalVisible(!modalVisible) 
                    setModalName("");
                    setModalDate("");
                    setNewName("");
                    setEditMode(!editMode)
                  }}>
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible) 
                    setModalName("");
                    setModalDate("");
                    setNewName("")
                    setEditMode(!editMode)
                  }}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                
              </View>
            </View>
          </Modal>
        </View>
        )

  } else {

    return (
      <View style={styles.centeredView}>
          <Modal
            statusBarTranslucent={false}
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
              setModalName("");
              setModalDate("");
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Add new habit</Text>
                <TextInput>{oldName}</TextInput>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible) 
                    setModalName("");
                    setModalDate("");
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

const Card = ({name, date, favorite, modalVisible, setModalVisible, setModalName, setModalDate, editMode={editMode}, setEditMode={setEditMode}}) => {

return (
  <Pressable
    style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]} 
    onPress={()=> {
      setEditMode(true)
      setModalVisible(!modalVisible)
      setModalName(name)
      setModalDate(date)
    }}
  >
    <View style={styles.card}>
      <Text style={styles.heading}>{name}: {date}</Text>
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
    fontSize: 24
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
  }
});
