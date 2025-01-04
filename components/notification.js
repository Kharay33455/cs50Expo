import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconA from "react-native-vector-icons/AntDesign";

import Fpfp from "./fpfp";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('screen');
export default function Notification(props) {
    const navigation = useNavigation();
    console.log(props.type);
    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate("PostE", { id: props.postId })
        }}>
            <View style={styles.notif}>
                <View style={styles.notifContainer}>
                {props.type === "rejected-join" &&
                        <Icon name="handshake-slash" color='grey' size={height / 50} style={{ textAlign: 'center' }} />
                    }                    
                    {props.type === "accepted-join" &&
                        <Icon name="handshake" color='teal' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {props.type === 'liked-post' &&
                        <Icon name="smile" color='green' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'liked-comment' &&
                        <IconA name='like1' color='blue' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'commented' &&
                        <Icon name="comment-dots" color={'orange'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'disliked-post' &&
                        <Icon name="frown" color={'red'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'ghost-liked' &&
                        <Icon name="ghost" color={'purple'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'shared' &&
                        <Icon name="share-alt-square" color={'blue'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                </View>
                <View>
                    <Fpfp uri={props.pfp} id={props.userId} />
                    <Text style={styles.text}>
                        {props.displayName} {props.message}
                    </Text>
                    <Text style={styles.notifPost}>
                        {props.post}
                    </Text>

                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    notif: {
        flexDirection: 'row',
        marginBottom: height / 50,
        borderColor: 'orange',
        borderTopWidth: height / 1000,
        borderBottomWidth: height / 1000,
        padding: height / 100

    },
    notifContainer:
    {
        width: width / 15,
        margin: width / 100
    },
    text:
    {
        fontSize: width / 30,
        fontWeight: 'bold'
    },
    notifPost:
    {
        marginTop: height / 100,
        width: width / 1.3
    }
})