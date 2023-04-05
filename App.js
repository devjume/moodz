import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProvider, {UserContext} from './lib/UserContext';

import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import SetGoalsScreen from './screens/Auth/SetGoalsScreen';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import BadHabitScreen from './screens/BadHabitScreen';
import TrackerScreen from './screens/TrackerScreen';
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function AuthNavigationStack({setIsLoggedIn}) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        ></Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SetGoals" component={SetGoalsScreen} />
      </Stack.Navigator>
    )
  }

  function NormalNavigationStack() {
    return(
      <Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === "Home") {
							iconName = "💣";
						} else if (route.name === "Calendar") {
							iconName = "🛖";
						} else if (route.name === "Statistics") {
							iconName = "📈";
						} else if (route.name === "Bad Habit") {
							iconName = "🚬";
						} else if (route.name === "Tracker") {
							iconName = "➕";
						}

						return <Text style={{ fontSize: 30 }}>{iconName}</Text>;
					},
				})}
			>
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Calendar" component={CalendarScreen} />
				<Tab.Screen name="Tracker" component={TrackerScreen} />
				<Tab.Screen name="Statistics" component={StatisticsScreen} />
				<Tab.Screen name="Bad Habit" component={BadHabitScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
			</Tab.Navigator>
    )
  }

  function NavigatorWrapper() {
    const { isLoggedIn } = useContext(UserContext)

    return (
      <Stack.Navigator>
        {isLoggedIn ? 
          <Stack.Screen name="App" component={NormalNavigationStack} options={{headerShown: false }}/>
           :  
          <Stack.Screen name="Auth" component={AuthNavigationStack} options={{headerShown: false }}/>
           }
      </Stack.Navigator>
    )
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <NavigatorWrapper />
      </NavigationContainer>
    </UserProvider>
  );
}


