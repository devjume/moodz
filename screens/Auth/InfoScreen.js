import { useState, useEffect, useContext }from 'react'
import { Text, View, StyleSheet, Pressable, Alert, ImageBackground } from "react-native";
import InfoCards from '../../components/InfoCards';

export default function InfoScreen({route, navigation}) {
  
  const { session } = route.params
  let hasUnsavedChanges = true;

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {

      if(!hasUnsavedChanges) {
        return
      }

      e.preventDefault();
      Alert.alert("Set goals","Please finish the info cards before setting goals.");
    })


  }, [navigation])

  return (
    <ImageBackground source={require('../../assets/forest.png')} style={component.container}> 
            <InfoCards session={session} navigation={navigation}></InfoCards>
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