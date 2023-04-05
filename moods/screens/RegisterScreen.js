import React from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton"


export default function RegisterScreen({navigation}) {

  function register() {
    console.log("registering")
  }


  return (
		<View style={styles.container}>
			<Text style={styles.header}>REGISTER SCREEN</Text>

			<CustomButton title={"Register"} onClick={register} />
			<CustomButton title={"Login"} onClick={() => navigation.navigate("Login")} />
		</View>
	);
}

