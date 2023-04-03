import React from 'react'
import { Text, View, StyleSheet, SafeAreaView, Pressable, Alert, Modal } from "react-native";
import { TextInput } from "react-native-paper";
import { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { fonts } from 'react-native-elements/dist/config';


export default function BadHabitScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalDate, setModalDate] = useState("");
  
  const data = [
    {
      id: 1,
      name: "Rööki",
      date: "2023-03-31T07:17:49+0000"
    },
    {
      id: 2,
      name: "Huumeetki",
      date: "2023-02-31T07:17:49+0000"
    }
  ]

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
						<Card key={item.id} name={item.name} date={item.date} modalVisible={modalVisible} setModalVisible={setModalVisible} setModalDate={setModalDate} setModalName={setModalName}/>
					)
				})
			}

      {modalVisible && <Form setModalVisible={setModalVisible} modalVisible={modalVisible} oldName={modalName} oldDate={modalDate}/>}

    </SafeAreaView>
  )
}

const Form = ({setModalVisible, modalVisible, oldName, oldDate}) => {

  if (oldName == null || oldName == "") {
    oldName = "Name"
  }

  return (
  <View style={styles.centeredView}>
      <Modal
        statusBarTranslucent={false}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add new habit</Text>
            <TextInput>{oldName}</TextInput>
            <TextInput>Add new habit</TextInput>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
    )
}

const Card = ({name, date, modalVisible, setModalVisible, setModalName, setModalDate}) => {

return (
  <Pressable
    style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#DCC9B6" : "#FFEDD7" }]} 
    onPress={()=> {
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
