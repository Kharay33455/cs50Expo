// Import neccessary modules
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from "react-native";
// Import custom component Pfp
import Pfp from './pfp'
import { useNavigation } from "@react-navigation/native";

const {width, height} = Dimensions.get('window');
// Button to eneble signed in users to add new community posts
function New(){
    return (
            <Image source = {require('../images/new.png')} style={styles.image}/>
    )
}


// Default function for Top.
export default function Top(props) {
    const navigation = useNavigation();
    const uri = props.uri || 'None';
    return (

        <View style={{alignSelf:'center', height: height/15}}>
        <View style={Platform.OS == 'android' ? [styles.container, {paddingTop: height/40}] : styles.container} >
            <TouchableOpacity>
            <Pfp uri = {uri}/>
            </TouchableOpacity>
            <Image source={require('../images/logo.png')} style={styles.image}/>
            <TouchableOpacity onPress={()=>{
                navigation.navigate('New Post');
            }}>
            <New/>
            </TouchableOpacity>
        </View>
        </View>
    )
}

// Style sheet
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width : width -(width/10),
    },
    image : {
        width : 40,
        height : 40,
        borderRadius : 25,

    },
})