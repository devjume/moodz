import { StyleSheet } from 'react-native';
   

export default StyleSheet.create({   
    
    container: {
        flex: 1,
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
        color:"#152d33",
        fontSize: 20
      },

});      