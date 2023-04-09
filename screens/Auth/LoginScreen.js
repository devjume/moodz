import { useState, useEffect, useContext }from 'react'
import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { supabase } from '../../lib/supabase';
import { UserContext, saveSessionLocalStorage } from '../../lib/UserContext';

import styles from '../../style/style';
import CustomInput from '../../components/CustomInput';
import CustomButton from "../../components/CustomButton"

export default function HomeScreen({route, navigation}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { setSession, setIsLoggedIn, TEST_MODE, LOGIN_AUTOMATICALLY } = useContext(UserContext)

  useEffect(() => {
    if (TEST_MODE === true) {
      setEmail("john@example.com");
      setPassword("password")
    }

    if(LOGIN_AUTOMATICALLY === true) {
      login();
    }
  }, [])

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
      console.log("Login Error:", error)
      return
    }
  
    setSession(data.session)
  }

  return (
    <View style={component.container}>
      <Text style={component.header}>Login</Text>
      <CustomInput placeholder={"Email"} inputMode={"email"} value={email} onChangeText={setEmail}/>
      <CustomInput placeholder={"Password"} inputMode={"text"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
      <CustomButton title={"Login"} onClick={login} />
      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={{fontWeight: "bold"}}>Don't have an account. Register</Text>
      </Pressable>
    </View>
  )
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