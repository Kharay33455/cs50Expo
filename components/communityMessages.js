import { useEffect, useRef, useState } from "react";
import Layout, { bodyHeight, baseFontSize, bodyWidth } from "./layout";
import {Keyboard, Image, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import FIcon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function CMessages(props) {
    const params = props.route.params || {};

    const messageListRef = useRef();

    const [text, setText] = useState('');

    // chat messages
    const [messages, setMessages] = useState([]);

    // while loading data
    const [isLoading, setIsLoading] = useState(true);

    // image to append to text if any
    const [image, setImage] = useState(null);

    // Check if user is typing
    const [isTyping, SetIsTyping] = useState(false);

    // image picker
    const pickImage = async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!response.canceled) {
            setImage(response.assets[0].uri);
        };
    };

    // get all messages
    const getAllCommMessages = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/comm-messages?commId=' + params['commId']);
            const result = await response.json()

            if (response.status === 200) {
                setMessages(result);
                setIsLoading(false);
                console.log(result)
                // wait a second to allow component render before attempting scroll to last message
                setTimeout(() => {
                    try {
                         messageListRef.current.scrollToOffset({ offset: 9000000000000000, animated: true });

                    } catch (error) {
                        if (!error instanceof TypeError){
                            console.error(error);
                        }
                    }
                }, 1000);
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllCommMessages();
    }, []);

    // send new messages function
    const sendNewMessages = async () => {
        // create frm with text and image if available. Set both to null after data extraction
        const form = new FormData();
        form.append('text', text);
        setText('');
        console.log(image);
        if (image) {
            form.append('image', {
                uri: image,
                name: 'q' + image,
                type: 'image/jpg',
            })
            setImage(null);
        }
        // attempt to send the message
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/comm-messages?commId=' + params['commId'],
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': messages['csrf']
                    },
                    body: form
                }
            );
            const result = await response.json()
            // load new messages
            setMessages(result);
            console.log(result);
            setTimeout(() => {
                try {
                    result['msg_list'] > 0 &&
                    messageListRef.current.scrollToEnd({ animated: true });

                } catch (error) {
                    console.error(error)
                }
            }, 1000);


        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        const showKeyboard = Keyboard.addListener('keyboardWillShow', ()=> {SetIsTyping(true)});
        const hideKeyboard = Keyboard.addListener('keyboardWillHide', ()=> {SetIsTyping(false)});

        // remove hooks
        return ()=>{
            showKeyboard.remove();
            hideKeyboard.remove();
        }

    }, []);



    return (
        <Layout>
            {isLoading ? <ActivityIndicator /> :
                <View style={{ height: bodyHeight * 0.93 }}>
                    <View>
                        <Text style={{ textAlign: 'center', fontWeight: '900', fontSize: baseFontSize * 5 }}>

                            {messages['community_details']['community_name']}

                        </Text>
                    </View>
                    {messages['msg_list'].length < 1 ? <Text style={{textAlign:'center', fontSize:baseFontSize * 5, fontWeight:'500'}}>No messages available. Send the first!</Text> :

                        <FlatList ref={messageListRef} data={messages['msg_list']} renderItem={({ item }) =>

                            <>
                                <View style={{ padding: bodyHeight / 50, backgroundColor: item['same'] ? 'orange' : 'blue', width: bodyWidth / 2, alignSelf: item['same'] ? 'flex-end' : 'flex-start', margin: bodyHeight / 100, borderRadius: bodyHeight / 50, borderTopLeftRadius: item['same'] && 0, borderTopRightRadius: !item['same'] && 0 }}>
                                    <Text style={{ color: 'white', fontWeight: '900', fontSize: baseFontSize * 4 }}>
                                        {item['sender']}
                                    </Text>
                                    {
                                        item['media'] !== null && <Image source={{ uri: item['media'] }} style={{ width: bodyWidth / 2.5, height: bodyWidth / 2.5 }} />
                                    }



                                    <Text style={{ color: 'white', fontSize: baseFontSize * 3, fontWeight: '700' }}>
                                        {item['message']}
                                    </Text>
                                    <Text style={{ color: 'gray', fontSize: baseFontSize * 2.5, marginLeft: bodyWidth / 3.5, fontWeight: '500' }}>
                                        {item['time_sent']}
                                    </Text>
                                </View>

                            </>
                        }

                            keyExtractor={(item) => item['id'].toString()}
                        />
                    }

                </View>
            }
            {
                // Text input field
            }
            <View style={ isTyping ? [styles.textInput, styles.textInputTyping] : styles.textInput}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ width: bodyWidth * 0.1 }}
                        onPress={() => {
                            pickImage();
                        }}
                    >
                        {image ? <Image source={{ uri: image }} style={{ width: bodyWidth / 15, height: bodyWidth / 15 }} /> :
                            <FIcon name="image" size={baseFontSize * 5} color={'blue'} style={styles.icon} />
                        }
                    </TouchableOpacity>
                    <View style={{ width: bodyWidth * 0.8 }}>
                        <TextInput style={{ borderWidth: 1, height: bodyHeight * 0.05, fontWeight:'900' }} value={text} onChangeText={setText} multiline={true} />
                    </View>
                    {
                        // send button
                    }
                    <TouchableOpacity style={{ width: bodyWidth * 0.1 }}
                        onPress={() => {
                            console.log(text);
                            sendNewMessages();
                        }}
                    >
                        <FIcon name="send" size={baseFontSize * 5} color={'blue'} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

        </Layout>
    )
}

const styles = StyleSheet.create({
    icon:
    {
        textAlign: 'center', margin: 'auto'
    },
    textInput:{
        height: bodyHeight * 0.07, width: bodyWidth, padding: height / 100, backgroundColor :'white'
    },
    textInputTyping:{
        position:'absolute', top:bodyHeight/2
    }
    
})