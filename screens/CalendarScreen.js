import React, { useEffect, useState} from 'react';
import styles from '../style/style';
import { View, Text, Modal, TextInput, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { supabase } from '../lib/supabase';
import { CircularProgress } from 'react-native-circular-progress';
import { ProgressBar } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';





export default function CalendarScreen() {

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

  const [notes, setNotes] = useState('');
  const [dailyMood, setDailyMood] = useState(0)
  const [moodText, setMoodText] = useState('')

  const [modalVisible, setModalVisible] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);



  useEffect(() => {

		getUserGoals()
    getUserNotes()
    getDateFromDailyTrack()
    getDailyMood()

	}, [])




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
		
	}, [])
	
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

  

  
	async function getUserGoals() {

		let { data: profiles, error } = await supabase

  		.from('profiles')
  		.select('sleep_goal, exercise_goal, relax_goal')
		
		if (error) {
			console.log("Couldn't fetch profile goals", error)
		}

		setSleepGoal(profiles[0].sleep_goal)
		setExerciseGoal(profiles[0].exercise_goal)
		setRelaxGoal(profiles[0].relax_goal)
    

    
    
	}




 ///fetch notes

  async function fetchDailyId() {
    const modifiedDate = new Date(date)

    const year = modifiedDate.getFullYear();
    const month = modifiedDate.getMonth() + 1;
    const day = modifiedDate.getDate();
    const wholeDate = `${year}-${month}-${day}`


    console.log(wholeDate)

    try {
      let { data, error } = await supabase
        .from('daily_track')
        .select("*")
        .eq('date', wholeDate)

      console.log("fetchDailyId data: ", data) 
      console.log("fetchDailyId error: ", error)
      if (data[0].mood !== undefined) {
        setNotes(data[0].mood)
      }
      else {

        setNotes("")
      }
      if (data.length === 0) {
        return undefined
      } else {
        return data[0].id
      }
    } catch (error) {
      console.log("fetchDailyId error", error)
      return undefined
    }

  }

  async function insertCategoryTrack(idAndCategory = undefined, dailyId) {
    try {

      let hoursToMinutes = (parseInt(hours) || 0) * 60
      let totalMinutes = hoursToMinutes + (parseInt(minutes) || 0)


      const { data, error } = await supabase
        .from('category_track')
        .upsert([
          { id: idAndCategory, category_id: activity, minutes: totalMinutes, note: notes, daily_id: dailyId, user_id: userID }
        ])

    }
    catch (error) {
      console.log("insertCategoryTrack error", error)
    }

  }

  async function fetchIdAndCategory(dailyId) {
    if (dailyId !== undefined) { 
      try {
        let { data, error } = await supabase
          .from('category_track')
          .select("*")
          .eq('daily_id', dailyId)
          .eq('category_id', parseInt(activity))

        console.log("fetchIdAndCategory data", data)
        console.log("fetchIdAndCategory error", error)
        return data[0].id
      }
      catch (error) {
        console.log("fetchIdAndCategory error", error) 

        
      }
    } else {
      return undefined
    }
  }


  async function insertDailyAndCategory() {
    try {
      let dailyId = await fetchDailyId()
      if (dailyId === undefined) {
        dailyId = await insertDailyTrack(dailyId)
        insertCategoryTrack(undefined, dailyId)
      } else {
        console.log(dailyId)
        const idAndCategory = await fetchIdAndCategory(dailyId)
        insertCategoryTrack(idAndCategory, dailyId)
      }

    } catch (error) {
      console.log("insertDailyAndCategory error", error)
    }

  }


  async function getDateFromDailyTrack() {
    let { data: daily_track, error } = await supabase
     .from('daily_track')
     .select('date, category_track(categorty_id, daily_id, user_id)')
      

      if (error) {
        console.log("Couldn't fetch profile notes")
      }
      else if (data.length > 0) {
     
        setNotes(daily_track[0].note);
      }

  }


  async function getUserNotes() {
    let { data: category_track, error } = await supabase
      .from('category_track')
      .select('note')
      .eq('daily_id'); 

      

      if (error) {
        console.log("Couldn't fetch profile notes")
      }
      else if (data.length > 0) {

      setNotes(category_track[0])
        

    }
  

  }





  // get mood

  async function getDailyMood() {
      let { data: daily_track, error } = await supabase
      .from('daily_track')
      .select('mood')

      if (error) {
        console.log("Couldn't fetch Daily Mood")
      } else {
        console.log(daily_track)
        setDailyMood(daily_track[0])
      }
  }

  function MoodIcon({dailyMood}) {
    let moodText
    // const moodText = this.state.moodText;
    switch (dailyMood){
    
      case (dailyMood === 1):
        moodText = "dizzy";
        break;
      case (dailyMood === 2):
        moodText = "frown";
        break;
      case (dailyMood === 3):
        moodText = "meh";
        break;
      case (dailyMood === 4):
        moodText = "smile";
        break;
      case (dailyMood === 5):
        moodText = "smile-beam";
        break;

      } 
      return <Text><FontAwesome5 name={moodText}  size={60} color="#ffe62a"/></Text>

  } 


  // calculate progress

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
				<Text style={{fontWeight: "bold", fontSize: 18 , paddingBottom: 4}}>{title}</Text>
				<View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between"}}>
			     <ProgressBar progress={progress} color={color} style={{minWidth: 300, height: 30, backgroundColor: "#D9D9D9", borderRadius: 25}}/>    
				</View>
				
			</View>
		)
	} 

  useEffect(() => {

    console.log("Modal avattu")

  }, [selectedDate])

function RenderModal({selectedDate}) {
  

    return (
      <Modal  visible={modalVisible} animationType="slide">
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.dayStatHeader}>Day Statistics</Text>
				<View style={{display: "flex", flexDirection: "row", gap: 90, alignItems: "center"}}>
					<Text style={styles.title}>{selectedDate}</Text>
          
				</View>
        
        <View style={{display: "flex", flexDirection: "row", gap: 90, alignItems: "center"}}>

          <View>
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

              <Text style={styles.subHeader}>Daily Progress</Text>

            </View>  

            <View>
              <MoodIcon dailyMood={dailyMood}/>
              
 
                
              <Text style={styles.subHeader}>Daily Mood</Text> 

            </View> 


          </View> 
			
				<CustomBar title={"Sleep"} progress={calculateProgress("sleep")} color={"#8B95DF"}/>

        <Text style={styles.dayStatHeader}>Sleep Notes</Text>
          <TextInput
              progress={insertDailyAndCategory()}
              style={{ height: 200, width: '80%', borderColor: 'gray', borderWidth: 1, marginTop: 20, marginBottom: 25 }}
              multiline={true}
              editable = {false}
              value={notes}
               
        />



				<CustomBar title={"Exercise"} progress={calculateProgress("exercise")} color={"#C44536"}/>

        <Text style={styles.dayStatHeader}>Exercise Notes</Text>
          <TextInput 
              progress={insertDailyAndCategory()}
              style={{ height: 200, width: '80%', borderColor: 'gray', borderWidth: 1, marginTop: 20, marginBottom: 25 }}
              multiline={true}
              editable = {false}
              value={notes}
               
        />



				<CustomBar title={"Relax"} progress={calculateProgress("relax")} color={"#498467"} />

        <Text style={styles.dayStatHeader}>Relax Notes</Text>
          <TextInput
              progress={insertDailyAndCategory()}
              style={{ height: 200, width: '80%', borderColor: 'gray', borderWidth: 1, marginTop: 20, marginBottom: 25 }}
              multiline={true}
              editable = {false}
              value={notes}
            
          />

        <Pressable style={styles.button} onPress={() => setModalVisible (false)} >
            <Text style={styles.buttonText2}>Close</Text>
          </Pressable>
			</View>
      </ScrollView>
      </Modal>
    );
  };


  return (
    <View>
      <CalendarList 
            onDayPress={handleDayPress} 
            markedDates={{ [selectedDate]: { selected: true } }} 
            pastScrollRange={6}
            futureScrollRange={1}
            scrollEnabled={true}/>
      {selectedDate && <RenderModal selectedDate={selectedDate} />}
    </View>
  );
}




