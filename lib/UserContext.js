import { useState, useEffect, createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export const UserContext = createContext(null);

export default function UserProvider({children}) {
  const [session, setSession] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState(null)
  const [userID, setUserID] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  const TEST_MODE = true;
  const LOGIN_AUTOMATICALLY = false;

  async function getSessionLocalStorage() {
    console.log("Getting session from localstorage")
    try {
      const jsonValue = await AsyncStorage.getItem('@userSession')
      setSession(jsonValue != null ? JSON.parse(jsonValue) : null)

      if (jsonValue !== null || jsonValue !== undefined) {
        const { data, error } = await supabase.auth.refreshSession(jsonValue.refresh_token)
        saveSessionLocalStorage(data.session)
        console.log("Refresh data", data)

        if(error) {
          console.log("refresh error", error)
        }
      }

      

    } catch (error) {
      console.log("Error reading local storage", error)
    }
  }

  async function saveSessionLocalStorage(session) {
    try {
      const jsonValue = JSON.stringify(session)
      await AsyncStorage.setItem('@userSession', jsonValue)
    } catch (error) {
      console.log("Saving to local storage error:", error)
    }
  }

  useEffect(() => {
    getSessionLocalStorage()
  }, [])
  
  // When session changes to null, clear username and id
  useEffect(() => {
    if (session == null) { 
      setUserID(null)
      setUsername(null)
      setUserEmail(null)
      saveSessionLocalStorage(null)
      return
    }
    
    saveSessionLocalStorage(session);
    setUserID(session.user.id)
    setUsername(session.user.user_metadata.username)
    setUserEmail(session.user.email)
    setIsLoggedIn(true)
  }, [session])
  

  return (
    <UserContext.Provider value={{ session, setSession, isLoggedIn, setIsLoggedIn, username, setUsername, userID, setUserID, userEmail, setUserEmail, TEST_MODE, LOGIN_AUTOMATICALLY}}>
      {children}
    </UserContext.Provider>
  )
}
