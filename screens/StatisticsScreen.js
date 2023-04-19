import { useEffect, useState, useContext } from 'react'
import styles from '../style/style';
import { View, Dimensions, ScrollView, Alert } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';



export default function StatisticsScreen() {

  const { setIsLoggedIn, setSession, username, userID, session } = useContext(UserContext)

  useEffect(() => {
    getData()
  }, [])


  async function getData() {
    let { data: category_track, error } = await supabase
    .from('category_track')
    .select('*')
    .eq('id', session.user.id)

    if(error) {
      Alert.alert("Error", error.message);
      console.log(category_track[0].category_id)
      return 
    }

    /* let relaxData = (category_track[0].relax_goal)/60;
    let exerciseData = (category_track[0].exercise_goal)/60;
    let sleepData = (category_track[0].sleep_goal)/60; */


    
    
   

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

  const sleep = {
    labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    datasets: [
      {

        //supabasedata tähän->
        data: [5, 6, 8, 7, 7, 5, 8],
        color: (opacity = 1) => `rgba(248, 237, 51, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Sleep(hours)"] 
  };

  const exercise = {
    labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    datasets: [
      {

        //supabasedata tähän->
        data: [25, 43, 18, 32, 24, 32, 34],
        color: (opacity = 1) => `rgba(226, 96, 73, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Exercise(hours)"] 
  };

  const relax = {
    labels: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    datasets: [
      {

        //supabasedata tähän->
        data: [25, 43, 18, 32, 24, 32, 34],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Relax(hours)"] 
  };


  
  
  return (
    <View style={styles.container}>
      
      <ScrollView>
      

      <LineChart
        data={sleep}
         width={screenWidth}
         height={250}
         chartConfig={chartConfig}
      />

      <LineChart
        data={exercise}
         width={screenWidth}
         height={250}
         
         chartConfig={chartConfig}
      />

      <LineChart
        data={relax}
         width={screenWidth}
         height={250}
         chartConfig={chartConfig}
      />

    </ScrollView>

    
    
    </View>
  )
}

