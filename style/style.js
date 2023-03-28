import { StyleSheet } from 'react-native';
   

export default StyleSheet.create({   
    
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        color:"#152d33",
        fontSize: 20
      },
      // VEETIN CSS
      selectionHeader:{
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
      },
      row: {
        marginTop: -200,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      inputWrap: {
        borderColor: "#cccccc",
        marginBottom: 10,

      },
      inputHours: {
        borderBottomWidth: 1,
        borderTopWidth:1,
        borderLeftWidth:1,
        fontSize: 20,
        color: "#6a4595",
        justifyContent: "center",
        alignItems: "center",
        textAlign:"center"

      },
      inputMinutes: {
        borderBottomWidth: 1,
        borderTopWidth:1,
        borderRightWidth:1,
        fontSize: 20,
        color: "#6a4595",
        justifyContent: "center",
        alignItems: "center",
        textAlign:"center" 
      },
      //
});      