import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import { useEffect, useState } from 'react';
import Notification from './notification';

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Alert() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const get_notifs = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/get-notifs');
            const result = await response.json();
            setData(result);
            setIsLoading(false);
            if (response.status ===301){
                navigation.navigate('Login', {err:result['err'], from : 'Alert'})
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        get_notifs();
    }, []);
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.top}>
                    { isLoading?
                    <Top /> : <Top uri = {data['pfp']}/>}
            </View>
            <View style={styles.head}>
                <TouchableOpacity style={styles.active} onPress={() => { navigation.navigate('Alert') }}>
                    <Text>
                        Notifications
                    </Text>
                </TouchableOpacity>
            </View>
                {
                    isLoading ?
                    <ActivityIndicator/>:
                    <View style={{paddingBottom: height/8, paddingTop:height/50}}>
                    <FlatList data={data['notif']} renderItem={({item})=> <Notification postId = {item['post_id']} post = {item['post']} userId = {item['user_id']} message={item['message']} pfp = {item['oppfp']} type={item['type']} displayName = {item['user']}/>} />
                    </View>
                    
                }
            <View style={styles.bottom}>
                <Footer active="notifications" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    }
});