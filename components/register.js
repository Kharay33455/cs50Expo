import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, TextInput, Text, View, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Footer from './footer';
import Top from './top';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');



export default function Register() {
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dName, setDisplayName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [serr, setSerr] = useState('');

    const sendRegistrationDetails = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/register',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: username,
                        pass: password,
                        pass2:confirmPass,
                        displayName: dName,
                    })
                }
            );
            const results = await response.json();
            if(response.status === 403){
                setSerr(results['err']);
            }
            if (response.status === 200){
                navigation.navigate('Profile');
            }

        }
        catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false);
        }
    }


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

                    <View style={{}}>
                        {serr && <Text style={{ color: 'red' }}>{serr}</Text>}

                        <Text style={[styles.emp,{alignSelf:'flex-start'}]}>USERNAME:</Text>
                        <TextInput style={styles.input} onChangeText={setUsername} value={username} placeholder='Choose a username'/>


                        <Text style={[styles.emp,{alignSelf:'flex-start'}]}>DISPLAY NAME:</Text>
                        <TextInput style={styles.input} onChangeText={setDisplayName} value={dName} placeholder='Display name'/>


                        <Text style={[styles.emp,{alignSelf:'flex-start'}]}>PASSWORD:</Text>
                        <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder='Choose a password' />


                        <Text style={[styles.emp,{alignSelf:'flex-start'}]}>CONFIRM PASSWORD:</Text>
                        <TextInput style={styles.input} onChangeText={setConfirmPass} value={confirmPass} placeholder='Confirm your password'/>


                        <TouchableOpacity onPress={() => {sendRegistrationDetails();}}>
                            <View style={styles.emp}>
                                <Text style={styles.logButton}>
                                    Register
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {
                            // go to login screen 
                        }


                        <Text>Already have an account? 
                                 <Text style={{color:'orange'}}onPress={()=>{
                                    navigation.navigate('Login')
                                }}>
                                     Log in instead
                                </Text>
                        </Text>
       

                    </View>
                </KeyboardAvoidingView>

                <View style={styles.bottom}>
                    <Footer active="globe-africa" />
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
        margin: width / 50
    },
    logButton: {
        fontSize: width / 30,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        padding: width / 50,
        paddingLeft: width / 4,
        paddingRight: width / 4,
        borderRadius: width / 10,
        textAlign:'center'
    },

});
