import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, TextInput, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Footer from './footer';
import Top from './top';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const { width, height } = Dimensions.get('window');



export default function Login(props) {
    const navigation = useNavigation();
    const params = props.route.params || {};
    const err = params['err'];
    const from = params['from'] || "Profile";



    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [csrf, setCsrf] = useState('');

    const login = async () => {
        console.log(csrf)
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/login',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: username,
                        pass: password
                    })
                }
            )
            if (response.status === 400) {
                navigation.navigate('Login', { err: 'Bad request', from: from })
            }
            if (response.status === 401) {
                navigation.navigate('Login', { err: 'Invalid username or password', from: from })
            }
            if (response.status === 200) {
                navigation.navigate(from)
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false);
        }
    }

    // Get csrf token to append to post request
    const get_csrf = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/login');
            const results = await response.json();
            setCsrf(results['csrf']);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        get_csrf();
    }, [])


    return (
        <>
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.top}>
                    <Top />
                </View>
            </SafeAreaView>
            <SafeAreaView style={styles.container}>

                <StatusBar style="auto" />
                <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>

                    <View style={styles.login}>
                        {err && <Text style={{ color: 'red' }}>{err}</Text>}

                        <Text style={styles.emp}>USERNAME:</Text>
                        <TextInput style={styles.input} onChangeText={setUsername} value={username} />

                        <Text style={styles.emp}>PASSWORD:</Text>
                        <TextInput style={styles.input} onChangeText={setPassword} value={password} />

                        <TouchableOpacity onPress={() => { login() }}>
                            <View style={styles.emp}>
                                <Text style={styles.logButton}>
                                    Log in
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {
                            // go to registration screen 
                        }
                        <Text>
                            Don't have an account? <Text style={{ color: 'orange' }} onPress={() => { navigation.navigate('Register') }}>Register with us.</Text>
                        </Text>


                    </View>
                </KeyboardAvoidingView>

                <View style={styles.bottom}>
                    {from === 'MyCommunity'?<Footer active="people-group"/>:from ==='Alert' ?<Footer active='notifications'/> : from === 'Dms'?<Footer active='message'/>: <Footer active="globe-africa"/> }
                    {//from === 'Profile'&&<Footer active="globe-africa"/>
                        }
                    {//from ==='Alert' &&<Footer active='notifications'/>
                        }
                    {//from === 'Dms'&&<Footer active='message'/>
                        }
                </View>
            </SafeAreaView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    login:
    {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: height / 1.1,
        width: width / 1.5
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
        height: height / 20,
        borderWidth: 1,
        width: width / 1.2
    },
    emp: {
        fontSize: width / 20,
        fontWeight: '900',
        margin: width / 100
    },
    logButton: {
        fontSize: width / 30,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        padding: width / 50,
        paddingLeft: width / 4,
        paddingRight: width / 4,
        borderRadius: width / 10
    },

});
