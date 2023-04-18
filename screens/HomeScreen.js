import { useEffect, useState, useContext } from 'react'
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';
import { Text, View, ScrollView, StyleSheet, FlatList, Alert, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { CircularProgress } from 'react-native-circular-progress';
import { ProgressBar } from 'react-native-paper';

import styles, {BACKGROUND_COLOR} from '../style/style';
import CustomButton from "../components/CustomButton"

export default function HomeScreen({navigation}) {
	const { setIsLoggedIn, setSession, username, userID } = useContext(UserContext)
	const [categories, setCategories] = useState([])
	const [date, setDate] = useState(new Date())
	const [dailyData, setDailyData] = useState()

	useEffect(() => {
		const dbDateFormat = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

		let { data, error } = supabase
  		.from('daily_track')
  		.select('*')
			//.eq("date", dbDateFormat)
			console.log(data)
			console.log(error)

	}, [])

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

	function moveBackwards() {
		console.log("back")
	}

	function moveForward() {
		console.log("forward")
	}

	function CustomBar({title, progress, color}) {
		return (
			<View>
				<Text style={{fontWeight: "bold", fontSize: 18, paddingBottom: 4}}>{title}</Text>
				<View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between"}}>
				<ProgressBar progress={progress} color={color} style={{minWidth: 300, height: 30, backgroundColor: "#D9D9D9", borderRadius: 25}}/>
				<Pressable onPress={() => navigation.navigate('Tracker')}>
					{({pressed}) => (
						<Ionicons name="add-circle-outline" size={38} color={"#292D32"}  />
					)}
				</Pressable>
				</View>
				
			</View>
		)
	}

	function badHabitContainer() {
		return (
			<View>
				<Text></Text>
			</View>
		)
	}

  return (
		<ScrollView contentContainerStyle={screen.container}>
			<View style={screen.section}>
				<Text style={screen.title}>Today</Text>
				<View style={{display: "flex", flexDirection: "row", gap: 90, alignItems: "center"}}>
					<Pressable onPress={moveBackwards} style={({pressed}) => [{backgroundColor: pressed ? 'rgba(103, 65, 80, 0.2)': 'rgba(103, 65, 80, 0.0)', borderRadius: 100, padding: 14}]} >
						<Ionicons name="arrow-back" size={30} color={"black"}  />
					</Pressable>
					<Text style={screen.title}>{date.getDate()}.{date.getMonth()}</Text>
					<Pressable onPress={moveForward} style={({pressed}) => [{backgroundColor: pressed ? 'rgba(103, 65, 80, 0.2)': 'rgba(103, 65, 80, 0.0)', borderRadius: 100, padding: 14}]} >
						<Ionicons name="arrow-forward" size={30} color={"black"} />	
					</Pressable>
				</View>
			</View>
			<CircularProgress
  			size={130}
  			width={18}
  			fill={33}
  			tintColor="#498467"
				arcSweepAngle={270}
				rotation={225}
  			backgroundColor="#D9D9D9"
				lineCap='round'
				style={{marginVertical: 10}}
				children={(e) => <Text style={{fontWeight: "bold", fontSize: 28}}>{e}</Text>}
				/>
			<View style={screen.barContainer}>
				<CustomBar title={"Relax"} progress={0.4} color={"#498467"} />
				<CustomBar title={"Exercise"} progress={0.4} color={"#C44536"}/>
				<CustomBar title={"Sleep"} progress={0.8} color={"#8B95DF"}/>
			</View>
		</ScrollView>
	);
}

const screen = StyleSheet.create({
  container: {
		display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 0,
		backgroundColor: BACKGROUND_COLOR,
		paddingVertical: 10,
  },
	section: {
		display: "flex",
    flexShrink: 1,
		flexDirection: "column",
		padding: 8,
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",	
	},
	barContainer: {
		display: "flex",
		gap: 16,
	}
});

