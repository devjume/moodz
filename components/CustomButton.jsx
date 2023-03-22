import React from 'react'
import { Text, Pressable, StyleSheet } from "react-native";


export default function button() {

	function clicked() {
		console.log("SLDL")
	}

  return (
    <Pressable onPress={clicked} style={({ pressed }) => [style.button, {backgroundColor: pressed ? "#facc15" : "yellow"}]}>
      <Text style={style.text}>Button</Text>
    </Pressable>
  )
}

const style = StyleSheet.create({
	button: {
		paddingVertical: 10,
		paddingHorizontal: 35,
		backgroundColor: "yellow",
		borderWidth: 1,
		borderColor: "black",
	},
	text: {
		color: "black",
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center",
	},
});