import { StatusBar } from 'expo-status-bar';
import { TouchableWithoutFeedback, Image, Dimensions, StyleSheet, TextInput, View, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Top from './top';
import { useEffect, useState } from 'react';
import Message from './message';
import Icon from 'react-native-vector-icons/FontAwesome';
// import image picker
import * as ImagePicker from 'expo-image-picker';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Messages(props) {
    const mProps = props.route.params || {};
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [text, setText] = useState('');
    console.log(mProps['oppfp']);

    const [image, setImage] = useState('');
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });




        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

// function to load all messages from chat id
    const sendId = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/show?id=' + mProps['id']);
            const result = await response.json();
            setData(result);
            setLoading(false);
        } catch (error) {
            console.log('error')
        }
    }
    // load messages
    useEffect(() => {
        sendId();

    }, []);

    useEffect(() => {

        const keyboardOn = Keyboard.addListener('keyboardWillShow', () => { setIsTyping(true) });
        const keyboardOff = Keyboard.addListener('keyboardWillHide', () => { setIsTyping(false) });

        return () => {
            keyboardOn.remove();
            keyboardOff.remove();
        }

    }, []);





    const sendMessage = async (uri) => {
        const token = data['csrf']

        const form = new FormData();

        if (image) {
            form.append('image', {
                uri: uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        }
        form.append('caption', text);
        form.append('id', mProps['id'])
        try {

            const response = await fetch('http://192.168.0.4:8000/chat/send-message',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': token
                    },
                    body: form
                }
            );

            const result = await response.json()
            setImage('');
            setText('');
            if (response.status === 200) {
                setData(result);
            }


        } catch (error) {
            console.log(error);
        }
    };



    return (

        <SafeAreaView style={styles.container}>

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <>

                    <View style={{ flex: height / 10 }}>
                        <StatusBar style="auto" />
                        <SafeAreaView style={styles.safe}>
                            <StatusBar barStyle="dark-content" />
                            <View style={styles.top}>
                                <Image source={ mProps['oppfp'] !== null ? { uri: mProps['oppfp'] } : require('../images/placeholder-male.jpg')} style={{ width: width / 10, height: width / 10, alignSelf: 'center', borderRadius: width / 10 }} />
                            </View>
                            <Text style={{ fontSize: width / 15, textAlign: 'center' }}>{mProps['displayName']}</Text>

                        </SafeAreaView>

                        <View style={styles.post}>
                            {loading ? <ActivityIndicator /> :
                                <>
                                    <View style={{ marginBottom: 2 * (height / 20) }}>

                                        <FlatList data={data['messages']} renderItem={({ item }) => <Message message={item} />} />
                                    
                                    </View>
                                    
                                </>

                            }

                        </View>

                    </View>

                    <View style={{ flex: isTyping ? height / 10 : height / 80 }}>

                        <View style={{ flexDirection: 'row' }}>
                            {image ?
                                <TouchableOpacity onPress={() => {
                                    pickImage();
                                }}>
                                    <Image source={{ uri: image }} style={{ width: height / 20, height: height / 20 }} />
                                </TouchableOpacity>
                                :
                                <Icon name='image' size={width / 10} style={{ margin: 'auto' }} onPress={() => {
                                    pickImage();
                                }} />}
                            <TextInput style={styles.input} onChangeText={setText} value={text} />
                            <Icon name='send' size={width / 10} style={{ margin: 'auto' }} onPress={() => {
                                sendMessage(image);
                            }} />
                        </View>

                        <View style={styles.bottom}>
                            <Footer active="message" />
                        </View>
                    </View>

                </>
            </TouchableWithoutFeedback>

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
        flexDirection: 'row',
    },
    bottom: {
        padding: height / 50,
        backgroundColor: 'orange',
        width: width,
    },
    input: {
        borderStyle: 'solid',
        borderColor: 'black',
        height: height / 20,
        borderWidth: 1,
        width: width / 1.3,
    },
    inputPressed: {
        marginTop: width
    },
    top: {
        textAlign: 'center'
    }
});
