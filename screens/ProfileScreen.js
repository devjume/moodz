import { useEffect, useState, useContext } from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet, Button } from "react-native";
import NumericInput from 'react-native-numeric-input';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserContext } from '../lib/UserContext';
import CustomButton from "../components/CustomButton";




export default function ProfileScreen() {
    
    const { username, userID, session } = useContext(UserContext)
    const [relax, setRelax] = useState(0);
    const [exercise, setExercise] = useState(0);
    const [sleep, setSleep] = useState(0);
    console.log(session.user.email)

    async function logOut() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        Alert.alert("Sign Out Error:", error.message)
        console.log("Sign Out Error:", error.message)
      }
  
      // setSession(null)
      setIsLoggedIn(false)
    }

    /* const { error } = await supabase
    .from('profiles')
    .update({ sleep_goal: sleepGoal, exercise_goal: exerciseGoal, relax_goal: relaxGoal })
    .eq('id', session.user.id)

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }

    setSession(session); 
  }*/

  return (
    <View style={style.container}>
        <Ionicons name="person-circle-outline" size={128} color="#682C0E" />
        <Text style={style.name}>{username}</Text>
        <Text style={style.email}>{session.user.email}</Text>

        <CustomButton title={"Log out"} onClick={logOut} />

        <Text style={style.update}>Update your goals</Text>
    <View style={style.goalInputs}>
      <View style={style.rivi}>
          <Text style={style.goal}>Relax</Text>
          <NumericInput value={relax} rightButtonBackgroundColor='#498467' 
            leftButtonBackgroundColor='#C44536' borderColor={"black"} style={style.numericInput} onChange={v => setRelax(v)}/>
      </View>
      <View style={style.rivi}>
          <Text style={style.goal}>Exercise</Text>
          <NumericInput value={exercise} rightButtonBackgroundColor='#498467' 
            leftButtonBackgroundColor='#C44536' borderColor={"black"} style={style.numericInput} onChange={v => setExercise(v)}/>
      </View>
      <View style={style.rivi}>
          <Text style={style.goal}>Sleep</Text>
          <NumericInput value={sleep} rightButtonBackgroundColor='#498467' 
            leftButtonBackgroundColor='#C44536' borderColor={"black"} style={style.numericInput} onChange={v => setSleep(v)}/>
      </View>
      <Button
      title='SAVE' style={style.save} color= "#498467"
      />
    </View> 
      
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10,
    backgroundColor: "#F9E0AE"
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
    }
});