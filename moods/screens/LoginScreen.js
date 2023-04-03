import React from 'react'
import styles from '../style/style';
import { Text, View, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton"


export default function LoginScreen({route, navigation}) {

  const { isSignedIn, hello } = route.params;

  function login() {
    console.log("logging in")
  }


  return (
		<View style={component.container}>
			<Text style={component.header}>Login</Text>
      <Text>ASD: {isSignedIn} - {hello}</Text>
			<CustomButton title={"Login"} onClick={login} />
			<CustomButton title={"Go To Register"} onClick={() => navigation.navigate("Register")} />
		</View>
	);
}

const component = StyleSheet.create({
	container: {
		flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    gap: 25,
	},
	header: {
		color: "black",
		fontWeight: "bold",
		fontSize: 36,
		textAlign: "center",
	},
});

