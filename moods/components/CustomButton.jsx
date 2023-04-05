import React from 'react'
import { Text, Pressable, StyleSheet } from "react-native";


export default function button({title, onClick}) {

  return (
		<Pressable
			onPress={onClick}
			style={({ pressed }) => [style.button, { backgroundColor: pressed ? "#facc15" : "yellow" }]}
		>
			<Text style={style.text}>{title}</Text>
		</Pressable>
	);
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