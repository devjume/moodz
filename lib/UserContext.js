import { useState, useEffect, createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext(null);

export default function UserProvider({children}) {
  const [session, setSession] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState(null)
  const [userID, setUserID] = useState(null)

  const TEST_MODE = true;
  const LOGIN_AUTOMATICALLY = false;
  
  async function getSessionLocalStorage() {
    try {
      const jsonValue = await AsyncStorage.getItem('@userSession')
      setSession(jsonValue != null ? JSON.parse(jsonValue) : null)
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
      saveSessionLocalStorage(null)
      return
    }

    saveSessionLocalStorage(session);
    setUserID(session.user.id)
    setUsername(session.user.user_metadata.username)
    setIsLoggedIn(true)
  }, [session])
  

  return (
    <UserContext.Provider value={{ session, setSession, isLoggedIn, setIsLoggedIn, username, setUsername, userID, setUserID, TEST_MODE, LOGIN_AUTOMATICALLY}}>
      {children}
    </UserContext.Provider>
  )
}
