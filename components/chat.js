import { Text, View, StyleSheet, Dimensions } from "react-native";
import Fpfp from "./fpfp";

// get dmensions
const { width, height } = Dimensions.get('screen')

// Default function
export default function Chat(props) {

    // This is a single chat object rendering
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View>
                <Fpfp uri = {props.pfp}/>
                </View>
                <View style={styles.content}>
                    <Text style={styles.displayName}>
                        {props.displayName}
                    </Text>
                    {
                        // Highlighting unread messages
                    }
                    <Text style={ props.isRead ? styles.lastText :  [styles.lastText,  {fontWeight:'900', color:'orange'}]}>
                        {props.lastText}
                    </Text>
                </View>
                <View style={{margin:'auto'}}>
                    <Text style={ props.isRead ? styles.time : {fontWeight:'900'} }>{props.time}</Text>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:
    {
        margin: width / 50
    },
    displayName:
    {
        fontWeight: '900',
        fontSize: width / 30
    },
    lastText: {
        color: '#5A5A5A',
        fontSize: width / 35
    },
    row:
    {
        flexDirection:'row',
        width:width
    },
    time :
    {
        color:'#5A5A5A'

    },
    content:
    {
        width:width/1.5,
        paddingLeft:width/50
    }
});