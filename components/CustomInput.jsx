import { TextInput, StyleSheet } from "react-native";


export default function CustomInput({placeholder, inputMode, value, onChangeText, secureTextEntry, autoCapitalize} ) {

  return (
		<TextInput
        style={component.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
				secureTextEntry={secureTextEntry ? secureTextEntry : false}
				autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
      />
	);
}

const component = StyleSheet.create({
	input: {
		borderWidth: 2,
		borderColor: "black",
		paddingHorizontal: 10,
		paddingVertical: 14,
		fontSize: 24,
		backgroundColor: "yellow",
		color: "black",
		minWidth: "80%",
		maxWidth: "80%",
	},
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


