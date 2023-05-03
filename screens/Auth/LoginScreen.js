import { useState, useEffect, useContext }from 'react'
import { Text, View, StyleSheet, Pressable, Alert, ImageBackground } from "react-native";
import { supabase } from '../../lib/supabase';
import { UserContext, saveSessionLocalStorage } from '../../lib/UserContext';

import styles from '../../style/style';
import AuthInputField from '../../components/AuthInputField';
import AuthButton from '../../components/AuthButton';

export default function HomeScreen({route, navigation}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { setSession, setIsLoggedIn, firstLogin, setFirstLogin, TEST_MODE, LOGIN_AUTOMATICALLY } = useContext(UserContext)

  useEffect(() => {

    const testEmail = "john@example.com"
    const testPasswd = "password"
    
    if (TEST_MODE === true) {
      setEmail(testEmail);
      setPassword(testPasswd)
    }

    if(LOGIN_AUTOMATICALLY === true && firstLogin === true) {
      setFirstLogin(false)
      login(testEmail, testPasswd);
    }
  }, [])

  async function login(email = email, password = password) {
    if ( email === "" || password === "") {
      Alert.alert("Login error", "Empty email or password")
      return
    }

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
    <ImageBackground source={require('../../assets/forest.png')} style={component.container}> 
      <Text style={component.header}>Login</Text>
      <AuthInputField placeholder={"Email"} inputMode={"email"} value={email} onChangeText={setEmail}/>
      <AuthInputField placeholder={"Password"} inputMode={"text"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
      <AuthButton title="Login" onClick={() => login(email, password)} />
      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={{fontWeight: "bold", color: "#fff"}}>Don't have an account? Register</Text>
      </Pressable>
    </ImageBackground>
  )
}

const component = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
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