import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase';
import { Text, View, StyleSheet, FlatList } from "react-native";

import styles from '../style/style';
import CustomButton from "../components/CustomButton"

export default function HomeScreen() {

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

	function buttonClick() {
		console.log("clicked");
	}

  return (
		<View style={styles.container}>
			<Text style={styles.header}>Today</Text>

			<Text>Daily Progress</Text>
			<Text>Daily Mood</Text>
			{
				categories.map((item) => {
					return (
						<Text key={item.id} style={{fontWeight: "bold"}}>{item.name}</Text>
					)
				})
			}
			<CustomButton title="AUTH" onClick={buttonClick} />
		</View>
	);
}

