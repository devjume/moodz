import { TextInput, StyleSheet } from "react-native";


export default function AuthInputField({placeholder, inputMode, value, onChangeText, secureTextEntry, autoCapitalize} ) {

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
		borderWidth: 3,
		borderColor: "rgba(129, 44, 44, 0.7)",
		paddingHorizontal: 10,
		paddingVertical: 14,
		fontSize: 24,
		backgroundColor: "#F9E0B6",
		color: "black",
		minWidth: "80%",
		maxWidth: "80%",
		borderRadius: 6,
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


