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
  const [exerciseDate, setExerciseDate] = useState([]);
  const [relaxDate, setRelaxDate] = useState([]);
  const [sleepDate, setSleepDate] = useState([]);


  const { setIsLoggedIn, setSession, username, userID, session } = useContext(UserContext)

  useEffect(() => {
    
    getExerciseData()
    getSleepData()
    getRelaxData()
   
  }, [])

  

  async function getSleepData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes, daily_track(date)')
    .order('date', {foreignTable:'daily_track', ascending: true})
    .eq('category_id', 1)
    

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }
    
    data.sort(function(a,b){
      return new Date(a.daily_track.date) - new Date(b.daily_track.date);
    });


    let dataSleep = [];
    let dateSleep = [];

    for(i = 0; i < data.length; i++) {
      minutes = Math.floor(data[i].minutes / 60);
      dataSleep.push(minutes)

      console.log(data[i].daily_track.date)

      const newDate = new Date(data[i].daily_track.date)
      const dd = newDate.getDate()
      const mm = newDate.getMonth()
      const dd_mm = (`${dd}` + "." + `${mm}`)
      dateSleep.push(dd_mm)

    }
    

    setSleepData(dataSleep.slice(-7))
    setSleepDate(dateSleep.slice(-7))
    
  }

  async function getExerciseData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes, daily_track(date)')
    .order('date', {foreignTable:'daily_track', ascending: true})
    .eq('category_id', 2)
    

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }
    
    data.sort(function(a,b){
      return new Date(a.daily_track.date) - new Date(b.daily_track.date);
    });


    let dataExercise = [];
    let dateExercise = [];

    for(i = 0; i < data.length; i++) {
      minutes = Math.floor(data[i].minutes / 60);
      dataExercise.push(minutes)

      console.log(data[i].daily_track.date)

      const newDate = new Date(data[i].daily_track.date)
      const dd = newDate.getDate()
      const mm = newDate.getMonth()
      const dd_mm = (`${dd}` + "." + `${mm}`)
      dateExercise.push(dd_mm)

    }
    

    setExerciseData(dataExercise.slice(-7))
    setExerciseDate(dateExercise.slice(-7))
    
  }

  async function getRelaxData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes, daily_track(date)')
    .order('date', {foreignTable:'daily_track', ascending: true})
    .eq('category_id', 3)
    

    if(error) {
      Alert.alert("Error", error.message);
      return 
    }
    
    data.sort(function(a,b){
      return new Date(a.daily_track.date) - new Date(b.daily_track.date);
    });


    let dataRelax = [];
    let dateRelax = [];

    for(i = 0; i < data.length; i++) {
      minutes = Math.floor(data[i].minutes / 60);
      dataRelax.push(minutes)

      console.log(data[i].daily_track.date)

      const newDate = new Date(data[i].daily_track.date)
      const dd = newDate.getDate()
      const mm = newDate.getMonth()
      const dd_mm = (`${dd}` + "." + `${mm}`)
      dateRelax.push(dd_mm)

    }
    

    setRelaxData(dataRelax.slice(-7))
    setRelaxDate(dateRelax.slice(-7))
    
  }





  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false 
  };




  let sleep = {
    labels: sleepDate,
    datasets: [
      {

        
        data: sleepData,
        color: (opacity = 1) => `rgba(248, 237, 51, ${opacity})`, 
        strokeWidth: 2, 
      }
    ],
    legend: ["Sleep (hours)"] 
  };

  let exercise = {
    labels: relaxDate,
    datasets: [
      {

        
        data: exerciseData,
        color: (opacity = 1) => `rgba(226, 96, 73, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Exercise (hours)"] 
  };

  let relax = {
    labels: exerciseDate,
    datasets: [
      {

        
        data: relaxData,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Relax (hours)"] 
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


       

    </ScrollView>

    
    
    </View>
  )
}

