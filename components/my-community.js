import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import { useEffect, useState } from 'react';
import SCommunity from './singleCommunity';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function MyCommunity() {

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getMyCommunities = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/community?which=mine');
            const result = await response.json()
            setData(result);
            setIsLoading(false);
            if (response.status === 301){
                navigation.navigate('Login', {err:result['err'], from : 'MyCommunity'});
            }

        }
        catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        getMyCommunities();
    }, []);






    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />

                <View style={styles.top}>
                    {isLoading ? <Top /> : <Top uri={data['pfp']} />}
                </View>
            </SafeAreaView>
            <View style={styles.head}>

                <TouchableOpacity style={styles.active} onPress={() => { navigation.navigate('MyCommunity') }}>
                    <Text>
                        My clubs
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate('Explore') }}>
                    <Text>
                        Clubs near me
                    </Text>
                </TouchableOpacity>

            </View>
            <View>
                {isLoading ? <ActivityIndicator /> :

                    <>
                        <FlatList data={data['communities']} renderItem={({ item }) =>
                            <SCommunity isPrivate = {item['is_private']} id={item['community']} creator={item['creator']} name={item['name']} memberCount={item['member_count']} />} />
                    </>

                }
            </View>
            <View style={styles.bottom}>
                <Footer active="people-group" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    },

});
