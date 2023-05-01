import { useEffect, useState, useContext, useCallback } from 'react'
import { supabase } from '../lib/supabase';
import { UserContext } from '../lib/UserContext';
import { Text, View, ScrollView, StyleSheet, FlatList, Alert, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { CircularProgress } from 'react-native-circular-progress';
import { ProgressBar } from 'react-native-paper';
import { addDays, min } from 'date-fns'
import { useIsFocused } from '@react-navigation/native';

import styles, {BACKGROUND_COLOR} from '../style/style';
import CustomButton from "../components/CustomButton"

export default function HomeScreen({navigation}) {
	const { setIsLoggedIn, setSession, username } = useContext(UserContext)
	const [todayDate, setTodayDate] = useState(new Date())
	const [dailyData, setDailyData] = useState()

	const [relaxValue, setRelaxValue] = useState(0)
	const [exerciseValue, setExerciseValue] = useState(0)
	const [sleepValue, setSleepValue] = useState(0)

	const [relaxGoal, setRelaxGoal] = useState(0)
	const [exerciseGoal, setExerciseGoal] = useState(0)
	const [sleepGoal, setSleepGoal] = useState(0)

	const [overallProgress, setOverallProgress] = useState(0)
	const [dataReceived, setDataReceived] = useState(false)

	const isFocused = useIsFocused();

	useEffect(() => {
		getUserGoals()
	}, [])

	useEffect(() => {
		console.log("focused")
	}, [isFocused])
	

	useEffect(() => {
		setSleepValue(0)
		setExerciseValue(0)
		setRelaxValue(0)
		calculateOverallProgress(0,0,0)

		async function getDailyData() {
			try {
				const dbDateFormat = todayDate.toISOString().split("T")[0]
				let { data: daily_track, error } = await supabase
				.from('daily_track')
				.select('id, mood, date, category_track(category_id, minutes, note)')
				.eq("date", dbDateFormat)
				
				if (error) {
					Alert.alert("Feth daily_track error", JSON.stringify(error))
					console.log("Feth daily_track error", error)
					setDailyData(null)
				}

				if (daily_track.length < 1) {
					setSleepValue(0)
					setExerciseValue(0)
					setRelaxValue(0)
					calculateOverallProgress(0,0,0)
				} else {

					let sleepMin = 0
					let exerciseMin = 0
					let relaxMin = 0

					setSleepValue(0)
					setExerciseValue(0)
					setRelaxValue(0)
					calculateOverallProgress(0,0,0)

					daily_track[0].category_track.forEach(element => {
						switch(element.category_id) {
							case 1:
								setSleepValue(element)
								sleepMin = element.minutes
								break;
							case 2:
								setExerciseValue(element)
								exerciseMin = element.minutes
								break;
							case 3:
								setRelaxValue(element)
								relaxMin = element.minutes
								break;
						}
					});

					calculateOverallProgress(sleepMin, exerciseMin, relaxMin)

				}

			} catch(error) {
				console.log("getDailyData() catch error", error)
			}
		}

		getDailyData()
		
	}, [todayDate])
	
	function calculateOverallProgress(sleepMin, exerciseMin, relaxMin) {
		if (sleepMin + exerciseMin + relaxMin === 0 ) {
			setOverallProgress(0)
		}

		function calculateSingleSection(minutes, goal) {
			const percentage = minutes / goal

			if (percentage > 1) {
				return 33.33
			} else {
				return isNaN(percentage) ? 0 : (percentage * 33.33)
			}
		}

		const sleepSection = calculateSingleSection(sleepMin, sleepGoal)
		const exerciseSection = calculateSingleSection(exerciseMin, exerciseGoal)
		const relaxSection = calculateSingleSection(relaxMin, relaxGoal)

		const progress = sleepSection + exerciseSection + relaxSection;

		setOverallProgress(isNaN(progress) ? 0 : Math.round(progress))
	}

	function calculateProgress(activity) {
		let progress = 0;
		switch(activity) {
			case "sleep":
				progress = ( sleepValue.minutes / sleepGoal)
				break;
			case "exercise":
				progress = ( exerciseValue.minutes / exerciseGoal)
				break;
			case "relax":
				progress = ( relaxValue.minutes / relaxGoal)
				break;
		}

		if (!isFinite(progress)) {
			return 0
		} else {
			return progress
		}

	}

	async function getUserGoals() {
		let { data: profiles, error } = await supabase
  		.from('profiles')
  		.select('sleep_goal, exercise_goal, relax_goal')
		
		if (error) {
			console.log("Error fetching profile goals:", error)
			return
		}

		if (profiles) {
			setSleepGoal(profiles[0].sleep_goal)
			setExerciseGoal(profiles[0].exercise_goal)
			setRelaxGoal(profiles[0].relax_goal)
		} else {
			setSleepGoal(0)
			setExerciseGoal(0)
			setRelaxGoal(0)
		}

		
		setDataReceived(true)
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

	function moveBackwards() {
		setTodayDate(addDays(todayDate, -1));
	}

	function moveForward() {
		setTodayDate(addDays(todayDate, 1));
	}

	function CustomBar({title, progress, color, categoryId}) {
		return (
			<View>
				<Text style={{fontWeight: "bold", fontSize: 18, paddingBottom: 4}}>{title}</Text>
				<View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between"}}>
				<ProgressBar progress={progress} color={color} style={{minWidth: 300, height: 30, backgroundColor: "#D9D9D9", borderRadius: 25}}/>
				<Pressable onPress={() => navigation.navigate('Tracker', { homeScreenActivityId: categoryId, homeScreenDate: todayDate.toISOString() })}>
					
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
					<Text style={screen.title}>{todayDate.getDate()}.{todayDate.getMonth()+1}</Text>
					<Pressable onPress={moveForward} style={({pressed}) => [{backgroundColor: pressed ? 'rgba(103, 65, 80, 0.2)': 'rgba(103, 65, 80, 0.0)', borderRadius: 100, padding: 14}]} >
						<Ionicons name="arrow-forward" size={30} color={"black"} />	
					</Pressable>
				</View>
			</View>
			<CircularProgress
  			size={130}
  			width={18}
  			fill={overallProgress}
  			tintColor="#498467"
				arcSweepAngle={270}
				rotation={225}
  			backgroundColor="#D9D9D9"
				lineCap='round'
				style={{marginVertical: 10}}
				children={(e) => <Text style={{fontWeight: "bold", fontSize: 28}}>{e}</Text>}
				/>
			<View style={screen.barContainer}>
				<CustomBar title={"Sleep"} progress={calculateProgress("sleep")} color={"#8B95DF"} categoryId={1}/>
				<CustomBar title={"Exercise"} progress={calculateProgress("exercise")} color={"#C44536"} categoryId={2}/>
				<CustomBar title={"Relax"} progress={calculateProgress("relax")} color={"#498467"} categoryId={3}/>
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

// TODO:
// * lisää bad habit laatikot home screeniin
// * home screen ei päivity automaattisesti, jos tunteja lisää esim. tracker screenillä
// * korjaa authsessionrefresh error
// 24.4 3h home screen
// 25.4 3h home screen
// home screen valmis = 8h