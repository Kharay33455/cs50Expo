import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from "@react-navigation/native";

let iconSize = 30
const {width, height} = Dimensions.get('window')
export default function Footer(props){

    const [footerData, setFooterData] = useState({});

    const getFooterDets = async()=>{
        try{
            const response = await fetch('http://192.168.0.4:8000/api-person/footer-details');
            const result = await response.json();
            setFooterData(result);
            console.log(result);

        }catch(error){
            console.error(error);
        }
    };


    
    useEffect(()=>{    
    getFooterDets();
    }, []);
    
    const active = props.active

    const navigation = useNavigation();
    return (
        <>
            <View style={styles.tray}>
                <TouchableOpacity onPress={()=>{navigation.navigate('Posts')}}>
                    <Icon name="globe-africa" size={iconSize} color={'black'} style={active =='globe-africa' ? [styles.icons, styles.active] : styles.icons}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('Search')}}>
                    <Icon name="search" size={iconSize} color={'black'} style={active =='search' ? [styles.icons, styles.active] : styles.icons}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('MyCommunity')}}>
                    <Icon6 name="people-group" size={iconSize} color={'black'} style={active =='people-group' ? [styles.icons, styles.active] : styles.icons}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{navigation.navigate('Alert')}} style={{position:'relative'}}>
                    <View style={{position:'absolute', right:0}}>
                        <Text style={{color:'white', textAlign:'right', fontWeight:'900'}}>
                            {footerData['notification_count'] !== 0 && footerData['notification_count'] }
                        </Text>
                    </View>
                    <MIcon name="notifications" size={iconSize} color={'black'} style={active =='notifications' ? [styles.icons, styles.active] : styles.icons}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('Dms')}}>
                    <MCIcon name={ footerData['has_new_message'] ?  "message-badge" :  "message" }size={iconSize} color={'black'} style={active =='message' ? [styles.icons, styles.active] : styles.icons}/>
                </TouchableOpacity>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    tray: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'stretch',
        width: width - (width/10),
        height : height/20
    },
    icons :{
        padding:height/100
    },
    active : {
        color:'green'
    }
})