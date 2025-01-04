import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import { useEffect, useState } from 'react';
import SCommunity from './singleCommunity';
import * as Location from 'expo-location';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Explore() {

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        // Function to get location and request permissions
        const getLocation = async () => {
            // Check for permissions and request if needed
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get current location
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation(location.coords);
            getMyCommunities(location.coords.longitude, location.coords.latitude, 0.2);
            console.log(location);
        };

        getLocation();

    }, []);



    const getMyCommunities = async (long, lat, dist) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/community?which=near&long=' + long + '&lat=' + lat + '&dist=' + dist);
            const result = await response.json()
            setData(result);
            setIsLoading(false);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            console.log(result)
        }

    };





    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />

                <View style={styles.top}>
                    {isLoading ?
                        <Top /> : <Top uri={data['pfp']} />}
                </View>
            </SafeAreaView>
            <View style={styles.head}>

                <TouchableOpacity onPress={() => { navigation.navigate('MyCommunity') }}>
                    <Text>
                        My clubs
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.active} onPress={() => { navigation.navigate('Explore') }}>
                    <Text>
                        Clubs near me
                    </Text>
                </TouchableOpacity>

            </View>
            <View>
                {isLoading ?
                    <>
                        <ActivityIndicator />
                        <Text style={{ fontSize: width / 10 }}>
                            Search time depends on your device gps settings...
                        </Text>
                    </> :

                    <>
                        <FlatList data={data['communities']} renderItem={({ item }) =>

                            <SCommunity requested = {item['requested']} isPrivate={item['is_private']} isMember={false} id={item['community']} creator={item['creator']} name={item['name']} memberCount={item['member_count']} />

                        } />
                        <TouchableOpacity onPress={() => {
                            setIsLoading(true);
                            getMyCommunities(location.longitude, location.latitude, dist = data['dist']);
                            console.log('done')
                            setIsLoading(false);

                        }}>
                            <View style={styles.emp}>
                                <Text style={styles.logButton}> Increase range </Text>

                            </View>
                        </TouchableOpacity>
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
    emp: {
        fontSize: width / 50,
        fontWeight: '200',
        width: width / 3,
        alignSelf: 'center',
        marginTop: height / 50,
        padding: width / 50,
    },
    logButton: {
        fontSize: width / 30,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        textAlign: 'center',
        padding: width / 50,
        borderRadius: width / 20
    }

});
