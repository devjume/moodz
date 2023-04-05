import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import BadHabitScreen from './screens/BadHabitScreen';
import TrackerScreen from './screens/TrackerScreen';
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from "./screens/RegisterScreen";

import { supabase } from "./lib/supabase"


function getIsSignedIn() {
	// custom logic here
	return false;
};

export default function App() {
	const Tab = createBottomTabNavigator();
	const Stack = createNativeStackNavigator();
  const isSignedIn = getIsSignedIn();

  const [session, setSession] = useState(null);

  useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	/* Navigation Stack, when user is loggedin */
	function NormalTabStack() {
		return (
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
			</Tab.Navigator>
		);
	}
	
	/* Navigation Stack, when user is not loggedin */
	function AuthStack() {
		return (
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					initialParams={{isSignedIn: isSignedIn, hello: "hellox" }}
				/>
				<Stack.Screen name="Register" component={RegisterScreen} />
			</Stack.Navigator>
		);
	}

	return (
		<NavigationContainer>{session && session.user ? <NormalTabStack /> : <AuthStack />}</NavigationContainer>
	);
}


