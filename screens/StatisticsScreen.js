import React from 'react'
import styles from '../style/style';
import { Text, View, Dimensions, ScrollView } from "react-native";
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
    labels: ["January", "February", "March", "April", "May", "June","July","August","September","October", "November", "December"],
    datasets: [
      {

        //supabasedata tähän->
        data: [25, 43, 18, 32, 24, 32, 34, 23, 23, 23, 23, 24],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Sleep"] 
  };

  const exercise = {
    labels: ["January", "February", "March", "April", "May", "June","July","August","September","October", "November", "December"],
    datasets: [
      {

        //supabasedata tähän->
        data: [25, 43, 18, 32, 24, 32, 34, 23, 23, 23, 23, 24],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Exercise"] 
  };

  const relax = {
    labels: ["January", "February", "March", "April", "May", "June","July","August","September","October", "November", "December"],
    datasets: [
      {

        //supabasedata tähän->
        data: [25, 43, 18, 32, 24, 32, 34, 23, 23, 23, 23, 24],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
    legend: ["Relax"] 
  };


  
  
  return (
    <View style={styles.container}>
      
      <ScrollView>
      <Text>Statistics</Text>

      <LineChart
        data={sleep}
         width={screenWidth}
         height={220}
         chartConfig={chartConfig}
      />

      <LineChart
        data={exercise}
         width={screenWidth}
         height={220}
         chartConfig={chartConfig}
      />

      <LineChart
        data={relax}
         width={screenWidth}
         height={220}
         chartConfig={chartConfig}
      />

    </ScrollView>

    
    
    </View>
  )
}

