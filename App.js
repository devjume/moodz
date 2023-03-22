import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import BadHabitScreen from './screens/BadHabitScreen';
import TrackerScreen from './screens/BadHabitScreen';

export default function App() {

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({ focused, color, size}) => {
            let iconName;

		        if (route.name === "Home") {
		        	iconName = "💣";
		        } else if (route.name === "Calendar") {
              iconName = "🛖"
            } else if (route.name === "Statistics") {
              iconName = "📈"
            } else if (route.name === "Bad Habit") {
              iconName = "🚬"
            } else if (route.name === "Tracker") {
              iconName = "➕"
            }


		        return <Text style={{fontSize: 30}}>{iconName}</Text>;
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Tracker" component={TrackerScreen} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} />
        <Tab.Screen name="Bad Habit" component={BadHabitScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}


