import React from 'react'
import { Text, Pressable, StyleSheet } from "react-native";


export default function CustomButton({title, onClick}) {

  return (
		<Pressable
			onPress={onClick}
			style={({ pressed }) => [style.button, { backgroundColor: pressed ? "#facc15" : "#498467" }]}
		>
			<Text style={style.text}>{title}</Text>
		</Pressable>
	);
}

const style = StyleSheet.create({
	button: {
		paddingVertical: 2,
		paddingHorizontal: 35,
		backgroundColor: '#498467',
	},
	text: {
		color: "white",
		fontSize: 15,
		textAlign: "center",
	},
});