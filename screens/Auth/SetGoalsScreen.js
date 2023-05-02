import { useState, useEffect,useContext }from 'react'
import { Text, View, StyleSheet, Alert, ImageBackground } from "react-native";
import { supabase } from '../../lib/supabase';
import { UserContext } from '../../lib/UserContext';
import styles from '../../style/style';
import AuthInputField from '../../components/AuthInputField';
import CustomButton from "../../components/CustomButton"
import AuthButton from '../../components/AuthButton';



export default function SetGoalsScreen({route, navigation}) {
  const [sleepGoalHours, setSleepGoalHours] = useState(null)
  const [exerciseGoalHours, setExerciseGoalHours] = useState(null)
  const [relaxGoalHours, setRelaxGoalHours] = useState(null)
  const [sleepGoalMins, setSleepGoalMins] = useState(null)
  const [exerciseGoalMins, setExerciseGoalMins] = useState(null)
  const [relaxGoalMins, setRelaxGoalMins] = useState(null)

  const { TEST_MODE, setSession } = useContext(UserContext)
  const { session } = route.params
  let hasUnsavedChanges = true;
  let totalSleepGoal = parseInt(sleepGoalHours || 0)*60 + parseInt(sleepGoalMins || 0)
  let totalExerciseGoal = parseInt(exerciseGoalHours || 0)*60 + parseInt(exerciseGoalMins || 0)
  let totalRelaxGoal = parseInt(relaxGoalHours || 0)*60 + parseInt(relaxGoalMins || 0)


  useEffect(() => {
    if (TEST_MODE === true) {
      setSleepGoalHours("7")
      setExerciseGoalHours("1")
      setRelaxGoalHours("1")
      setSleepGoalMins("45")
      setExerciseGoalMins("30")
      setRelaxGoalMins("15")
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
    if (totalSleepGoal === null || totalExerciseGoal === null || totalRelaxGoal === null) {
      Alert.alert("Set goals", "Set your daily goals before continuing");
      return;
    }

    hasUnsavedChanges = false

    const { error } = await supabase
    .from('profiles')
    .update({ sleep_goal: totalSleepGoal, exercise_goal: totalExerciseGoal, relax_goal: totalRelaxGoal })
    .eq('id', session.user.id)

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }

    setSession(session);
  }

  function sanitazedMinutes(value, category) {
    // Remove non-numeric characters
    const mins = value.replace(/[^0-9]/g, '');

    // Limit the input to 59
    
      // Ensure sanitizedValue is not greater than 59
      const sanitizedValue = parseInt(mins);
      if (sanitizedValue > 59) {
        switch (value, category) {
          case "sleep":
            console.log("Unta tässä");
            setSleepGoalMins('59');
            console.log("Category here",category)
            break;
          case "exercise":
            console.log("Liikuntaa tässä");
            setExerciseGoalMins('59')
            console.log("Category here",category)
            break;
          case "relax":
            console.log("Relaxointi tässä");
            setRelaxGoalMins('59')
            console.log("Category here",category)
            break;
          default:
            console.log(`Invalid category: ${category}`);
        }
      } else {
        switch (category) {
          case "sleep":
            setSleepGoalMins(mins);
            break;
          case "exercise":
            setExerciseGoalMins(mins);
            break;
          case "relax":
            setRelaxGoalMins(mins);
            break;
          default:
            console.log(`Invalid category: ${category}`);
        }
      }
    
  };

  function sanitazedHours(value, category) {
    // Remove non-numeric characters
    const hrs = value.replace(/[^0-9]/g, '');

    // Limit the input to 23
      // Ensure sanitizedValue is not greater than 59
      const sanitizedValue = parseInt(hrs, 10);
      if (sanitizedValue > 23) {
      alert("Maximum time for a task is 23 hours and 59 minutes")
        switch (value, category) {
          case "sleep":
            console.log("Uni tunnit tässä");
            setSleepGoalHours('23');
            console.log("Category here",category)
            break;
          case "exercise":
            console.log("Liikunta tunnit tässä");
            setExerciseGoalHours('23')
            console.log("Category here",category)
            break;
          case "relax":
            console.log("Relaxointi tunnit tässä");
            setRelaxGoalHours('23')
            console.log("Category here",category)
            break;
          default:
            console.log(`Invalid category: ${category}`);
        }
      } else {
        switch (category) {
          case "sleep":
            setSleepGoalHours(hrs);
            break;
          case "exercise":
            setExerciseGoalHours(hrs);
            break;
          case "relax":
            setRelaxGoalHours(hrs);
            break;
          default:
            console.log(`Invalid category: ${category}`);
        }
      }
    
  };
    
    

  return (
    <ImageBackground source={require('../../assets/forest.png')} style={component.container}>
      <Text style={component.header}>Set your daily goals</Text>
      <AuthInputField placeholder={"Sleep Goal (hours)"} inputMode={"numeric"} value={sleepGoalHours} onChangeText={(value) =>setSleepGoalHours(value, "sleep")}/>
      <AuthInputField placeholder={"Sleep Goal (minutes)"} inputMode={"numeric"} value={sleepGoalMins} onChangeText={(value) => sanitazedMinutes(value, "sleep")}/>

      <AuthInputField placeholder={"Exercise Goal (hours)"} inputMode={"numeric"} value={exerciseGoalHours} onChangeText={(value) =>setExerciseGoalHours(value, "exercise")}/>
      <AuthInputField placeholder={"Exercise Goal (minutes)"} inputMode={"numeric"} value={exerciseGoalMins} onChangeText={(value) => sanitazedMinutes(value, "exercise")}/>

      <AuthInputField placeholder={"Relax Goal (hours)"} inputMode={"numeric"} value={relaxGoalHours} onChangeText={(value) =>setRelaxGoalHours(value, "relax")}/>
      <AuthInputField placeholder={"Relax Goal (minutes)"} inputMode={"numeric"} value={relaxGoalMins} onChangeText={(value) => sanitazedMinutes(value, "relax")}/>
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