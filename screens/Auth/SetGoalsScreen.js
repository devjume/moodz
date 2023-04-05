import { useState, useEffect,useContext }from 'react'
import { Text, View, StyleSheet, Alert } from "react-native";
import { supabase } from '../../lib/supabase';
import { UserContext } from '../../lib/UserContext';
import styles from '../../style/style';
import CustomInput from '../../components/CustomInput';
import CustomButton from "../../components/CustomButton"



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
    console.log(session)
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
    <View style={component.container}>
      <Text style={component.header}>Set your daily goals</Text>
      <CustomInput placeholder={"Sleep Goal"} inputMode={"numeric"} value={sleepGoal} onChangeText={setSleepGoal}/>
      <CustomInput placeholder={"Exercise Goal"} inputMode={"numeric"} value={exerciseGoal} onChangeText={setExerciseGoal}/>
      <CustomInput placeholder={"Relax Goal"} inputMode={"numeric"} value={relaxGoal} onChangeText={setRelaxGoal}/>
      <CustomButton title={"Continue"} onClick={saveGoals} />
    </View>
  )
}

const component = StyleSheet.create({
	container: {
		flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    gap: 25,
	},
	header: {
		color: "black",
		fontWeight: "bold",
		fontSize: 36,
		textAlign: "center",
	},
});