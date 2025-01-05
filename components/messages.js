import { StatusBar } from 'expo-status-bar';
import { TouchableWithoutFeedback, Image, Dimensions, StyleSheet, TextInput, View, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import Message from './message';
import Icon from 'react-native-vector-icons/FontAwesome';
// import image picker
import * as ImagePicker from 'expo-image-picker';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Messages(props) {
    // props passed in dictionary during navigation
    const mProps = props.route.params || {};
    // store return from server
    const [data, setData] = useState({});
    // true is data is not yet delivered by server, set to false when delivered
    const [loading, setLoading] = useState(true);
    // keep track of weather or not user hs started typing
    const [isTyping, setIsTyping] = useState(false);
    // text to send back as new message
    const [text, setText] = useState('');
    // image if any
    const [image, setImage] = useState('');
    // ref to target message list
    const flatListRef = useRef();

    // Image pick
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        // check if user canceled
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
            console.log(error);
        }
    }
    // load messages
    useEffect(() => {
        sendId();

    }, []);

    useEffect(() => {
        // hide or show keyboard when user wants to start typing
        const keyboardOn = Keyboard.addListener('keyboardWillShow', () => { setIsTyping(true) });
        const keyboardOff = Keyboard.addListener('keyboardWillHide', () => { setIsTyping(false) });
        // remove hoot after component is closed
        return () => {
            keyboardOn.remove();
            keyboardOff.remove();
        }
    }, []);

    useEffect(()=>{
        if (flatListRef.current){
            flatListRef.current.scrollToEnd({animated:true});
        }
    })

// send new message. uri is image uri if any. It is stored in a dynamic variable image
    const sendMessage = async (uri) => {
        const token = data['csrf']

        const form = new FormData();
// image if aailable
        if (image) {
            form.append('image', {
                uri: uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        }
        // append text and id of chat to send message to
        form.append('caption', text);
        form.append('id', mProps['id'])
        try {

            // get response from server
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
                                <Image source={mProps['oppfp'] !== null ? { uri: mProps['oppfp'] } : require('../images/placeholder-male.jpg')} style={{ width: width / 10, height: width / 10, alignSelf: 'center', borderRadius: width / 10 }} />
                            </View>
                            <Text style={{ fontSize: width / 15, textAlign: 'center' }}>{mProps['displayName']}</Text>

                        </SafeAreaView>

                        <View style={styles.post}>
                            {loading ? <ActivityIndicator /> :
                                <>
                                    <View style={{ marginBottom: 2 * (height / 20) }}>

                                        <FlatList ref={flatListRef} data={data['messages']} renderItem={({ item }) => <Message message={item} />} />

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
