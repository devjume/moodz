import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Pressable, Button } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
import style from './style/style';

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
				screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: "#444554",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#DCC9B6",
          },
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Profile')} style={{marginRight: 6}}>
              <Ionicons name={"person-circle-sharp"} size={38} color={"#DCC9B6"} />
            </Pressable>
          ),
          tabBarShowLabel: false,
          tabBarStyle: {backgroundColor: "#444554"},
					tabBarIcon: ({ focused, color, size, tabBarActiveTintColor }) => {
						let iconName;

						if (route.name === "Home") {
							iconName = "md-home";
						} else if (route.name === "Calendar") {
							iconName = "calendar";
						} else if (route.name === "Statistics") {
							iconName = "md-stats-chart-outline";
						} else if (route.name === "Bad Habit") {
							return <Ionicons name={"md-logo-no-smoking"} size={32} color={focused == true ? "#fff" : "#DCC9B6"} />
						} else if (route.name === "Tracker") {
              return (
                <View style={{backgroundColor: "#498467", width: 75, height: 75, borderRadius: 500, bottom: -10, position: "absolute", display: "flex", justifyContent:"center", alignContent:"center", alignItems:"center", "shadowColor": "#000", shadowOffset: {width: 0, height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                  <MaterialIcons name="add" size={64} style={{}} color={focused == true ? "#fff" : "#DCC9B6"} />
                </View>
              )
						}

            return <Ionicons name={iconName} size={24} color={focused == true ? "#fff" : "#DCC9B6"} />
					},
				})}
			>
				<Tab.Screen name="Home" component={HomeScreen} />
				<Tab.Screen name="Calendar" component={CalendarScreen} />
				<Tab.Screen name="Tracker" component={TrackerScreen} />
				<Tab.Screen name="Statistics" component={StatisticsScreen} />
				<Tab.Screen name="Bad Habit" component={BadHabitScreen} />
			</Tab.Navigator>
    )
  }

  function NavigatorWrapper() {
    const { isLoggedIn } = useContext(UserContext)

    return (
      <Stack.Navigator>
        {isLoggedIn ? <>
          <Stack.Screen name="App" component={NormalNavigationStack} options={{headerShown: false }}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{
            headerTitleStyle: {
            fontWeight: "bold",
            color: "#DCC9B6",
            },
            headerStyle: {
              backgroundColor: "#444554",
            },
            headerTintColor: "#DCC9B6",
          
          }} />
          </>
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
        <StatusBar style='light' />
      </NavigationContainer>
    </UserProvider>
  );
}


