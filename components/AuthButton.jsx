import React, { useEffect } from 'react'
import { Text, Pressable, StyleSheet } from "react-native";


export default function AuthButton({title, onClick}) {

  return (
		<Pressable
			onPress={onClick}
			style={({ pressed }) => [style.button, { backgroundColor: pressed ? "#674150" : "#411124" }]}
		>
			<Text style={style.text}>{title}</Text>
		</Pressable>
	);
}

const style = StyleSheet.create({
	button: {
		width: "50%",
    backgroundColor: "#411124",
    opacity: 0.9,
    padding: 12,
    borderColor: "#812C2C",
    borderWidth: 3,
    borderRadius: 6,
	},
	text: {
		color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
	},
});