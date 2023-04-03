import { useEffect, useState, useContext } from 'react'
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';
import { Text, View, StyleSheet, FlatList } from "react-native";

import styles from '../style/style';
import CustomButton from "../components/CustomButton"

export default function HomeScreen() {
	const { setIsLoggedIn, setSession, username, userID } = useContext(UserContext)
	const [categories, setCategories] = useState([])
	
	useEffect(() => {
		fetchCategories()
	}, [])

  async function fetchCategories() {
		
		let { data: category, error } = await supabase
		.from('category')
		.select('*')

		if (error) {
			console.log("error", error)
		} else {
			setCategories(category)
		}

  }

	async function logOut() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			Alert.alert("Sign Out Error:", error.message)
			console.log("Sign Out Error:", error.message)
		}

		setSession(null)
		setIsLoggedIn(false)
	}

  return (
		<View style={styles.container}>
			<Text style={styles.header}>Today</Text>

			<Text>Daily Progress</Text>
			<Text>Daily Mood</Text>
			<Text>Username: {username}</Text>
			<Text>UserID: {userID}</Text>
			{
				categories.map((item) => {
					return (
						<Text key={item.id} style={{fontWeight: "bold"}}>{item.name}</Text>
					)
				})
			}
			<CustomButton title={"Log out"} onClick={logOut} />
		</View>
	);
}

