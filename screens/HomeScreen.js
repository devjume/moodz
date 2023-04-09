import { useEffect, useState, useContext } from 'react'
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";

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

	async function selectDailyTrack() {
		let { data: daily_track, error } = await supabase
  		.from('daily_track')
  		.select('*')

		if (error) {
			Alert.alert("Feth daily_track error", JSON.stringify(error))
			console.log("Feth daily_track error", error)
			return
		}

		console.log("daily_track rows:")
		daily_track.forEach(row => {
			const category_track_rows = selectDailyTrack(row.id)
			console.log(row)
			console.log("\tCategory entries:")
			category_track_rows.forEach(row => {
				console.log(`\t\t${row}`)
			})
			console.log("---")
		});
		console.log("------")
	}

	async function selectCategoryTrack(id) {
		let { data: category_track, error } = await supabase
  		.from('category_track')
  		.select('*')
			.eq('daily_id', id)

		if (error) {
			Alert.alert("Feth category_track error", JSON.stringify(error) )
			console.log("Feth category_track error", error)
			return
		}
		return category_track;
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
			<CustomButton title={"Test daily_track select"} onClick={selectDailyTrack} />
			<CustomButton title={"Test category_track select"} onClick={selectCategoryTrack} />
			<CustomButton title={"Log out"} onClick={logOut} />
		</View>
	);
}

