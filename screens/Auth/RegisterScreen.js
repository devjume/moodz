import {useState, useEffect, useContext }from 'react'
import { Text, View, StyleSheet, Pressable, Alert, ImageBackground } from "react-native";
import { supabase } from '../../lib/supabase';
import { UserContext } from '../../lib/UserContext';

import styles from '../../style/style';
import AuthInputField from '../../components/AuthInputField';
import CustomButton from "../../components/CustomButton"
import AuthButton from '../../components/AuthButton';


export default function RegisterScreen({navigation}) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { TEST_MODE } = useContext(UserContext)

  useEffect(() => {
    if (TEST_MODE === true) {  
      setEmail(`test_${Date.now().toString()}@example.com`)
      setUsername(`name_${Date.now().toString()}`)
      setPassword("password")
    }
  }, [])

  async function register() {
    const { data, error } = await supabase.auth.signUp(
			{
				email: email,
				password: password,
				options: {
					data: {
						username: username,
						sleep_goal: 0,
						relax_goal: 0,
						exercise_goal: 0,
					}
				}
			})

    if(error) {
      Alert.alert(error.message)
			console.log("Registration Error:", error)
      return;
		}
    
    setEmail("")
    setUsername("")
    setPassword("")
    navigation.navigate("SetGoals", {session: data.session})
  }


  return (
    <ImageBackground source={require('../../assets/forest.png')} style={component.container}>
      <Text style={component.header}>Register</Text>
      <AuthInputField placeholder={"Email"} inputMode={"email"} value={email} onChangeText={setEmail}/>
      <AuthInputField placeholder={"Name"} inputMode={"text"} value={username} onChangeText={setUsername} autoCapitalize={"sentences"}/>
      <AuthInputField placeholder={"Password"} inputMode={"text"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
      <AuthButton title={"Register"} onClick={register} />
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={{fontWeight: "bold", color: "#fff"}}>Already have an account. Login</Text>
      </Pressable>
    </ImageBackground>
  )
}

const component = StyleSheet.create({
	container: {
		flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    gap: 25,
    flexGrow: 1,
    width: "100%",
    height: "100%",
	},
	header: {
		color: "#7C3140",
		fontWeight: "bold",
		fontSize: 36,
		textAlign: "center",
	},
});