import { useState, useEffect,useContext }from 'react'
import { Text, View, StyleSheet, Alert, ImageBackground } from "react-native";
import { supabase } from '../../lib/supabase';
import { UserContext } from '../../lib/UserContext';
import styles from '../../style/style';
import AuthInputField from '../../components/AuthInputField';
import CustomButton from "../../components/CustomButton"
import AuthButton from '../../components/AuthButton';



export default function SetGoalsScreen({route, navigation}) {
  const [sleepGoal, setSleepGoal] = useState(null)
  const [exerciseGoal, setExerciseGoal] = useState(null)
  const [relaxGoal, setRelaxGoal] = useState(null)

  const { TEST_MODE, setSession } = useContext(UserContext)
  const { session } = route.params
  let hasUnsavedChanges = true;


  useEffect(() => {
    if (TEST_MODE === true) {
      setSleepGoal("480")
      setExerciseGoal("60")
      setRelaxGoal("60")
    }
  }, [])

  // Prevent user from going back to register screen
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {

      if(!hasUnsavedChanges) {
        return
      }

      e.preventDefault();
      Alert.alert("Set goals", "Set your daily goals before continuing");
    })


  }, [navigation])

  // Update goals to profiles table
  async function saveGoals() {
    if (sleepGoal === null || exerciseGoal === null || relaxGoal === null) {
      Alert.alert("Set goals", "Set your daily goals before continuing");
      return;
    }

    hasUnsavedChanges = false

    const { error } = await supabase
    .from('profiles')
    .update({ sleep_goal: sleepGoal, exercise_goal: exerciseGoal, relax_goal: relaxGoal })
    .eq('id', session.user.id)

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }

    setSession(session);
  }
    
    

  return (
    <ImageBackground source={require('../../assets/forest.png')} style={component.container}>
      <Text style={component.header}>Set your daily goals</Text>
      <AuthInputField placeholder={"Sleep Goal (minutes)"} inputMode={"numeric"} value={sleepGoal} onChangeText={setSleepGoal}/>
      <AuthInputField placeholder={"Exercise Goal (minutes)"} inputMode={"numeric"} value={exerciseGoal} onChangeText={setExerciseGoal}/>
      <AuthInputField placeholder={"Relax Goal (minutes)"} inputMode={"numeric"} value={relaxGoal} onChangeText={setRelaxGoal}/>
      <AuthButton title={"Continue"} onClick={saveGoals} />
    </ImageBackground>
  )
}

const component = StyleSheet.create({
	container: {
		flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    gap: 25,
    width: "100%",
    height: "100%",
	},
	header: {
		color: "#7C3140",
		fontWeight: "bold",
		fontSize: 36,
		textAlign: "center",
	},
});