import { StyleSheet } from 'react-native';

export const BACKGROUND_COLOR = '#DCC9B6'

export default StyleSheet.create({

  container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCC9B6'
  },

  header: {

    marginTop: 30,
    marginBottom: 15,
    flexDirection: 'row',

  },

  footer: {
    marginTop: 20,
    backgroundColor: 'skyblue',
    flexDirection: 'row'
  },

  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#75d9af",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: "#152d33",
    fontSize: 20
  },
  // VEETIN CSS
  selectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  activity: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrap: {
    borderColor: "#cccccc",
  },
  inputHours: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    fontSize: 20,
    color: "#6a4595",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 4,
  },
  inputMinutes: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    fontSize: 20,
    color: "#6a4595",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fafafa",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    padding: 4,
  },
  calendar: {
    flexShrink: 1,
    padding: 10,
    backgroundColor: "#fafafa",
    width: 250,
    alignItems: "center",
    textAlign: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#dedede",
    borderWidth: 2,
  },
  //

  //Aarnen Css
  dayStatHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginTop: 25,
    paddingTop: 15
  },
      
  title: {
     fontSize: 28,
     fontWeight: "bold",	
  },

  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
    
  }

  
      


      


     

      
});      