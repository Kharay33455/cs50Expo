import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import { useEffect, useState } from 'react';
import Chat from './chat';


const { width, height } = Dimensions.get('window');



export default function Dms() {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const get_chats = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/')
            const result = await response.json()
            setData(result);
            setLoading(false);
            if (response.status === 301){
                navigation.navigate("Login", {err:result['err'], from : 'Dms'})
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_chats();
        console.log(data);

    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.top}>
                    { isLoading ?
                    <Top /> : <Top uri = {data['pfp']}/>}
                </View>
            </SafeAreaView>
            <View style={styles.head}>

                <TouchableOpacity style={styles.active} onPress={() => { navigation.navigate('Dms') }}>
                    <Text>
                        Private Chats
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate('Cms') }}>
                    <Text>
                        Community Chats
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                {isLoading ? <ActivityIndicator /> : 
                <FlatList data={data['chats']} renderItem={({ item }) => 
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('Messages', {id : item['chat']['id'] , displayName: item['other_user']['display_name'], oppfp:item['other_user']['pfp']})
                    }}>
                <Chat displayName={item['other_user']['display_name']} pfp = {item['other_user']['pfp']} time = {item['chat']['time']} lastText = {item['chat']['last_text']}/>
                </TouchableOpacity>
                } 
                />
                }

            </View>

            <View style={styles.bottom}>
                <Footer active="message" />
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
