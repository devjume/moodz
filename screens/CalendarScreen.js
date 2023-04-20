import React, { useEffect, useState} from 'react';
import styles, {BACKGROUND_COLOR} from '../style/style';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { supabase } from '../lib/supabase';
import { CircularProgress } from 'react-native-circular-progress';
import { ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Header } from 'react-native-elements';




export default function CalendarScreen({navigation}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [data, setData] = useState({});
/*   const [sleepData, setSleepData] = useState({});
  const [exerciseData, setExerciseData] = useState({});
  const [relaxData, setRelaxData] = useState({}); */
  
  const [todayDate, setTodayDate] = useState(new Date())
  const [dailyData, setDailyData] = useState()

  
  const [relaxValue, setRelaxValue] = useState(0)
	const [exerciseValue, setExerciseValue] = useState(0)
	const [sleepValue, setSleepValue] = useState(0)

  const [relaxGoal, setRelaxGoal] = useState(0)
	const [exerciseGoal, setExerciseGoal] = useState(0)
	const [sleepGoal, setSleepGoal] = useState(0)

  const [modalVisible, setModalVisible] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);




/*     useEffect(() => {
    
    fetchExerciseData(selectedDate)
    fetchSleepData(selectedDate)
    fetchRelaxData(selectedDate)
  }, [selectedDate]) 

    const fetchSupabaseData = async (date) => {
    const { data, error } = await supabase
      .from('daily_track')
      .select('date, mood')


    if (error) {
      console.error(error);
    } else {
      const newData = {};
      data.forEach((item) => {
        newData[item.date] = item;
      });
      setData(newData);
    }
  }; 


  async function fetchSleepData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes')
    .eq('category_id', 1)



    if(error) {
      Alert.alert("Error", error.message);
      console.log("Error")
      return 
    }

    let dataSleep = data;

    setSleepData(dataSleep)
    
  }

  async function fetchExerciseData() {
    
    let { data, error } = await supabase
    .from('category_track')
    .select('minutes')
    .eq('category_id', 2)



    if(error) {
      Alert.alert("Error", error.message);
      console.log("Error")
      return 
    }

    let dataExercise = data;

    setExerciseData(dataExercise)
    
  }

  async function fetchRelaxData() {
    

    let { data, error } = await supabase
    .from('category_track')
    .select('minutes')
    .eq('category_id', 3)



    if(error) {
      Alert.alert("Error", error.message);
      console.log("Error")
      return 
    }

    let dataRelax = parseFloat(data)/60;


    console.log("NNNN", dataRelax)

    setRelaxData(dataRelax)
    
  } */


  useEffect(() => {
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

		const overAllMinutes = sleepMin + exerciseMin + relaxMin
		const overAllGoals = sleepGoal + exerciseGoal + relaxGoal
		const progress = Math.ceil((overAllMinutes / overAllGoals)* 100)
		
		setOverallProgress(isNaN(progress) ? 0 : progress)
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




  const handleDayPress = (day) => {

    setSelectedDate(day.dateString);
    setModalVisible(true);
  };



	function CustomBar({title, progress, color}) {
		return (
			<View>
				<Text style={{fontWeight: "bold", fontSize: 18, paddingBottom: 4}}>{title}</Text>
				<View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between"}}>
			     <ProgressBar progress={progress} color={color} style={{minWidth: 300, height: 30, backgroundColor: "#D9D9D9", borderRadius: 25}}/>    
				</View>
				
			</View>
		)
	}
  


  const renderModal = () => {
    const event = data[selectedDate] || {};

    return (
      <Modal  visible={modalVisible} animationType="slide">
    {/*     <View style={styles.container}>
          <Text style={styles.dayStatHeader}>Day Statistics</Text>
          <Text>Date: {selectedDate}</Text> 
          <Text>Sleep: {event.sleep || '-'}</Text>
          <Text>Exercise: {event.exercise || '-'}</Text>
          <Text>Relax: {event.relax || '-'}</Text>
          <TouchableOpacity onPress={() => setModalVisible (false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View> */}

      <View style={styles.container}>
        <Text style={styles.dayStatHeader}>Day Statistics</Text>
				<View style={{display: "flex", flexDirection: "row", gap: 90, alignItems: "center"}}>
					<Text style={screen.title}>{selectedDate}</Text>
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
			
				<CustomBar title={"Sleep"} progress={calculateProgress("sleep")} color={"#8B95DF"}/>
				<CustomBar title={"Exercise"} progress={calculateProgress("exercise")} color={"#C44536"}/>
				<CustomBar title={"Relax"} progress={calculateProgress("relax")} color={"#498467"} />

        <TouchableOpacity onPress={() => setModalVisible (false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
			</View>
      </Modal>
    );
  };

  return (
    <View>
      <CalendarList onDayPress={handleDayPress} markedDates={{ [selectedDate]: { selected: true } }} 
            pastScrollRange={12}
            futureScrollRange={20}
            scrollEnabled={true}/>
      {selectedDate && renderModal()}
    </View>
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


