import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, TextInput, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Sresults from './sresults';
import Top from './top';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Search(props) {
    console.log(props.route.params);
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
                <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />
                  <View style={styles.top}>
                <Top/>
                </View>
                </SafeAreaView>
            <View style={styles.post}>
                <TextInput value={search} onChangeText={setSearch} placeholder='Search' style={styles.input} />
                <TouchableOpacity onPress={()=>{navigation.navigate(Sresults)}}>
                        <Icon name='search' size={width/15} style = {{paddingLeft:(width*0.16)/4}} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
                <Footer active="search" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    post: {
        paddingLeft: width / 50,
        paddingRight: width / 50,
        flexDirection: 'row'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    input: {
        borderStyle: 'solid',
        borderColor: 'black',
        height: height/20,
        borderWidth: 1,
        width: width / 1.2
    }
});
