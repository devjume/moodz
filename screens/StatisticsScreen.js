import React from 'react'
import styles from '../style/style';
import { View, Dimensions, ScrollView } from "react-native";
import { LineChart } from 'react-native-chart-kit';



export default function StatisticsScreen() {



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
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"],
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
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"],
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

