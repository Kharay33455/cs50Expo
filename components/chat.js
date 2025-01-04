import { Text, View, StyleSheet, Dimensions } from "react-native";
import Fpfp from "./fpfp";

const { width, height } = Dimensions.get('screen')
export default function Chat(props) {
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
                    <Text style={styles.lastText}>
                        {props.lastText}
                    </Text>
                </View>
                <View style={{margin:'auto'}}>
                    <Text style={styles.time}>{props.time}</Text>
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