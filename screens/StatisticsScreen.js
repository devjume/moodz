import { useEffect, useState, useContext } from 'react'
import styles from '../style/style';
import { View, Dimensions, ScrollView, Alert, StyleSheet, Button } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';



export default function StatisticsScreen() {

  const [sleepData, setSleepData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [relaxData, setRelaxData] = useState([]);
  const [scale, setScale] = useState('day');


  const { setIsLoggedIn, setSession, username, userID, session } = useContext(UserContext)

  useEffect(() => {
    
    getExerciseData()
    getSleepData()
    getRelaxData()
   
  }, [])

  

  async function getSleepData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes')
    .eq('category_id', 1)

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }


    let dataSleep = [];

    for(i = 0; i < data.length; i++) {

      minutes = Math.floor(data[i].minutes / 60);
      dataSleep.push(minutes)
    }
    

    setSleepData(dataSleep.slice(-7))
    
  }

  async function getExerciseData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes')
    .eq('category_id', 2)

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }

    let dataExercise = [];

    for(i = 0; i < data.length; i++) {

      minutes = Math.floor(data[i].minutes / 60);
      dataExercise.push(minutes)
    }
    

    setExerciseData(dataExercise.slice(-7))
    
  }

  async function getRelaxData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes')
    .eq('category_id', 3)

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }

    let dataRelax = [];

    for(i = 0; i < data.length; i++) {

      minutes = Math.floor(data[i].minutes / 60);
      dataRelax.push(minutes)
    }
    

    setRelaxData(dataRelax.slice(-7))
  }





  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false 
  };




  let sleep = {
    labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    datasets: [
      {

        
        data: sleepData,
        color: (opacity = 1) => `rgba(248, 237, 51, ${opacity})`, 
        strokeWidth: 2, 
      }
    ],
    legend: ["Sleep(hours)"] 
  };

  let exercise = {
    labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    datasets: [
      {

        
        data: exerciseData,
        color: (opacity = 1) => `rgba(226, 96, 73, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Exercise(hours)"] 
  };

  let relax = {
    labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    datasets: [
      {

        
        data: relaxData,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Relax(hours)"] 
  };


  async function toggleScale() {
    if (scale === 'day') {
      setScale('month');
      
      sleep.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      sleep.datasets[0].data = relaxData;
      exercise.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      exercise.datasets[0].data = exerciseData;
      relax.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      relax.datasets[0].data = relaxData;
      
    } else {
      setScale('day');;
      
      sleep.labels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      sleep.datasets[0].data = relaxData;
      exercise.labels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      exercise.datasets[0].data = exerciseData;
      relax.labels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      relax.datasets[0].data = relaxData;
      
    }
  };


  
  
  return (
    <View style={styles.container}>
      
      <ScrollView>
      
      {sleepData.length > 0 &&
        <LineChart
        data={sleep}
         width={screenWidth}
         height={250}
         chartConfig={chartConfig}
         fromZero={true}
      /> 
      }
       

       {exerciseData.length > 0 &&
        <LineChart
        data={exercise}
         width={screenWidth}
         height={250}
         chartConfig={chartConfig}
         fromZero={true} 
      /> 
      }

      {relaxData.length > 0 &&
        <LineChart
        data={relax}
         width={screenWidth}
         height={250}
         chartConfig={chartConfig}
         fromZero={true}
      /> 
      }


        <Button style={styles.subHeader} title={`Toggle to ${scale}-scale`} onPress={toggleScale} />

    </ScrollView>

    
    
    </View>
  )
}

