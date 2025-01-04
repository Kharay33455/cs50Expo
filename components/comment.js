import { Text, View, StyleSheet, Dimensions } from "react-native"
import Fpfp from "./fpfp"

const { height, width } = Dimensions.get('screen')

export default function Comment(props) {
    return (
        < >
            <View style={styles.container}>
                <View style={styles.commentHead}>
                    <Fpfp uri={props.comment['pfp']} />
                    <View>
                        <Text>
                            {props.comment['display_name']}
                        </Text>
                        <Text>
                            @{props.comment['user_name']}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.comment}>
                        {props.comment['comment']}
                    </Text>
                    <Text style={{marginLeft:width/20}}>
                        {props.comment['time']}
                    </Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    commentHead:
    {
        flexDirection: 'row'
    },
    comment:
    {
        fontSize: width / 30,
        width: width / 2,
        marginLeft: width / 30,

    },
    container: {
        marginBottom: height / 300,
        marginTop: height / 100
    }
})