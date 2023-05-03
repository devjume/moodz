import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { UserContext } from '../lib/UserContext';

const infoCards = [
  {
    title: 'Welcome to Moodz!',
    description: 'Please note that this life management app is not intended to provide medical advice or replace the advice of a healthcare professional. We, the creators of the app, are not experts in the medical or health fields. This app is designed to assist you in tracking your daily activities, such as sleep, exercise, and relaxation, to help you achieve your personal goals.',
  },
  {
    title: 'Profile',
    description: 'In the profile page you can update your activity goals. Also log out button is found in this page',
  },
  {
    title: 'Home',
    description: 'In the home page you can see a progress bar for each activity and also a total progress\'o\'meter of all activities combined. You can also add or update the activities by pressing the "+" icon that is next each activity.',
  },
  {
    title: 'Calendar',
    description: 'In the calendar you can see your days progress in different colors: red if you haven\t reached anywhere close to your goals, yellow if you achieved some of your goals, green if you reached most of your goals. You also can view an individual day by selecting it from the calendar',
  },
  {
    title: 'Daily Log',
    description: 'In the Daily Log screen you are able to add or update any activity\'s data. Pick the date and activity that you want to add or update to and press save',
  },
  {
    title: 'Statistics',
    description: 'In statistics page you can view your progress of the last week. From these graphs you can see how well have you achieved your goals in the long run.',
  },
  {
    title: 'Bad Habit Breaker ',
    description: 'In the bad habit page you are able to add new bad habits that you have stopped. Once you\'ve added a bad habit a counter will tell you how long have you gone without doing this particular habit. You can also update or delete existing bad habits if you want to.',
  },
  {
    title: 'Get started',
    description: 'Next you will set your daily goal duration on the following activities:' ,
    activities: 'Sleep, Exercise, Relax',
    description2: 'The durations are your own personal goals that are set by you to try to achieve daily.',
  },
];

const Card = ({ title, description, activities, description2 }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.text}>{description}</Text>
    <Text style={styles.activityText}>{activities}</Text>
    <Text style={styles.text}>{description2}</Text>

  </View>
);

const CardCarousel = ({navigation, session}) => {
  const [index, setIndex] = useState(0);
  const card = infoCards[index];
  const [pressed, setPressed] = useState(false);
  const disabled = index === 0 && !pressed;

  const handlePrevious = () => {
    setIndex(Math.max(index - 1, 0));
  };

  const handleNext = () => {
    setIndex(Math.min(index + 1, infoCards.length - 1));
  };

  const finished = () => {
    navigation.navigate("SetGoals", {session: session})
  };

  return (
    <View style={styles.container}>
      <View >
        <Card {...card} />
      </View>
      <View style={styles.buttonRow}>
        <Pressable onPress={handlePrevious} style={[styles.navigateButton, disabled && styles.disabled]}>
          <Text style={styles.navigateText}>{index > 0 ? 'Previous' : ''}</Text>
        </Pressable>
        <Pressable style={styles.navigateButton} onPress={index < infoCards.length - 1 ? handleNext : finished}>
          <Text style={styles.navigateText}>{index < infoCards.length - 1 ? 'Next' : 'Finished'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CardCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
    width: "100%",
    height: "100%",
  },
	card: {
    marginTop: 50,
		borderWidth: 3,
		borderColor: "rgba(129, 44, 44, 0.7)",
		paddingHorizontal: 25,
		paddingVertical: 25,
		fontSize: 24,
		backgroundColor: "#F9E0B6",
		color: "black",
		minWidth: "70%",
    minHeight: "70%",
    maxWidth: "85%",
    maxHeight:"80%",
		borderRadius: 6,
    textAlign: "center",
	},
	buttonRow: {
		flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    margin: 20
	},

	activityText: {
		color: "black",
		fontSize: 20,
    fontWeight: "bold",
		textAlign: "center",
    marginVertical: 15
	},
  text: {
		color: "black",
		fontSize: 16,
		textAlign: "center",
    marginVertical: 15
	},
  title: {
    fontSize: 24,
    marginBottom: 20,
  }, 
  navigateButton: {
		width: "40%",
    backgroundColor: "#411124",
    opacity: 0.9,
    padding: 12,
    borderColor: "#812C2C",
    borderWidth: 3,
    borderRadius: 6,
    marginHorizontal: 10,
	},
	navigateText: {
		color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
	},
  disabled:{
    opacity: 0
  }
});