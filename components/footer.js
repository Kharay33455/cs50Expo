import { useState } from "react";
import { Dimensions, StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon6 from 'react-native-vector-icons/FontAwesome6';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from "@react-navigation/native";

let iconSize = 30
const {width, height} = Dimensions.get('window')
export default function Footer(props){
    
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

                <TouchableOpacity onPress={()=>{navigation.navigate('Alert')}}>
                    <MIcon name="notifications" size={iconSize} color={'black'} style={active =='notifications' ? [styles.icons, styles.active] : styles.icons}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('Dms')}}>
                    <Icon6 name="message" size={iconSize} color={'black'} style={active =='message' ? [styles.icons, styles.active] : styles.icons}/>
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
    },
    icons :{
        padding:width/100
    },
    active : {
        color:'green'
    }
})