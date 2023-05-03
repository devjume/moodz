import { useEffect, useState, useContext } from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet, Button, Modal } from "react-native";
import NumericInput from 'react-native-numeric-input';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserContext } from '../lib/UserContext';
import CustomButton from "../components/CustomButton";
import { supabase } from '../lib/supabase';





export default function ProfileScreen() {
    
    const { setIsLoggedIn, setSession, username, userID, userEmail, session } = useContext(UserContext)
    const [relax, setRelax] = useState(0);
    const [exercise, setExercise] = useState(0);
    const [sleep, setSleep] = useState(0);
    const [showModal, setShowModal] = useState(false);



    useEffect(() => {
      getGoals()
    }, [])

    

    async function getGoals() {
      try {
      let { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      // .eq('id', session.user.id)

      if(error) {
        Alert.alert("Error", error.message);
        return 
      }
      console.log(profiles)
      let relaxGoal = (profiles[0].relax_goal)/60;
      let exerciseGoal = (profiles[0].exercise_goal)/60;
      let sleepGoal = (profiles[0].sleep_goal)/60;

      setRelax(parseFloat(relaxGoal))
      setExercise(parseFloat(exerciseGoal))
      setSleep(parseFloat(sleepGoal))
    } catch(error) {
      console.log("try catch error, getGoals", error)
    }

    }
    

    async function logOut() {
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        Alert.alert("Sign Out Error:", error.message)
        console.log("Sign Out Error:", error.message)
      }
      setSession(null)
      setIsLoggedIn(false)
      
    }
    async function updateGoals() {

      let sleepMin = sleep*60;
      let exerciseMin = exercise*60;
      let relaxMin = relax*60;

      const { data, error } = await supabase
      .from('profiles')
      .update({ sleep_goal: sleepMin, exercise_goal: exerciseMin, relax_goal: relaxMin })
      .eq('id', session.user.id)

      console.log(data)
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000)

      if(error) {
        Alert.alert("Error", error.message);
        return 
      }
    }
  

  return (
    <View style={style.container}>
        <Ionicons name="person-circle-outline" size={128} color="#682C0E" />
        <Text style={style.name}>{username}</Text>
        <Text style={style.email}>{userEmail}</Text>

        <CustomButton title={"Log out"} onClick={logOut} />

        <Text style={style.update}>Update your goals (hours)</Text>
    <View style={style.goalInputs}>
      <View style={style.rivi}>
          <Text style={style.goal}>Relax</Text>
          <NumericInput initValue={relax} value={relax} minValue={0} rightButtonBackgroundColor='#498467' 
          valueType='real' step={0.25} leftButtonBackgroundColor='#C44536' borderColor={"black"} style={style.numericInput} onChange={v => setRelax(v)}/>
      </View>
      <View style={style.rivi}>
          <Text style={style.goal}>Exercise</Text>
          <NumericInput initValue={exercise} minValue={0} rightButtonBackgroundColor='#498467' 
          valueType='real' step={0.25} leftButtonBackgroundColor='#C44536' borderColor={"black"} style={style.numericInput} onChange={v => setExercise(v)}/>
      </View>
      <View style={style.rivi}>
          <Text style={style.goal}>Sleep</Text>
          <NumericInput initValue={sleep} minValue={0} rightButtonBackgroundColor='#498467' 
          valueType='real' step={0.25} leftButtonBackgroundColor='#C44536' borderColor={"black"} style={style.numericInput} onChange={v => setSleep(v)}/>
      </View>
      
      <Button onPress={updateGoals}
      title='SAVE' style={style.save} color= "#498467"
      />
    </View> 
    <Modal transparent={true} visible={showModal} animationType="fade">
                  <View>
                    <Text style={style.modalText}>Data saved</Text>
                  </View>
                </Modal>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10,
    backgroundColor: '#DCC9B6'
},
  goalInputs: {
    flex: 1,
    minWidth: 300,
    // backgroundColor: "red"
  },
    rivi: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "left",
        alignContent: "flex-start",
        // backgroundColor: "yellow",
        padding: 5,
        minWidth: 200,
        marginBottom: 25
    },
    name: {
      fontSize: 36,
      color: "#682C0E"
    },
    email: {
      fontSize: 20,
      padding: 10,
      color: "#682C0E"
    },
    save: {
      margin: 100,
      alignSelf: "flex-end"
    },
    goal: {
      textAlign: "left",
      fontSize: 20,
      fontWeight: 600,
      color: "#682C0E"
    },
    update: {
      color: "#682C0E",
      fontSize: 24
    },
    numericInput: {
      borderColor: "#00000",
      backgroundColor: "#0000"
    },
    modalText: {
      textAlign: "center",
      fontSize: 18,
      fontWeight: 'bold',
      backgroundColor: "#ffffff",
      padding: 17,
    },
});