import { useEffect, useRef, useState } from "react";
import Layout, { bodyHeight, baseFontSize, bodyWidth } from "./layout";
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View , ActivityIndicator} from "react-native";
import FIcon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function CMessages(props) {
    const params = props.route.params || {};

    const messageListRef = useRef();

    const [text, setText] = useState('');

    // chat messages
    const [messages, setMessages] = useState([]);

    // while loading data
    const [isLoading, setIsLoading] = useState(true);

    const getAllCommMessages = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/comm-messages?commId=' + params['commId']);
            const result = await response.json()
            const index = result['last_id'] -1
            
            if (response.status === 200){
                setMessages(result);
                setIsLoading(false);
                console.log(result)
            setTimeout(() => {
                messageListRef.current.scrollTooffSet({ offset:9000,  animated: true });
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
        const form = new FormData();
        form.append('text', text);
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
            setMessages(result);
            console.log(result)
            setTimeout(() => {
                messageListRef.current.scrollToEnd({  animated: true });
            }, 1000);

        } catch (error) {
            console.error(error);
        }
    };



    return (
        <Layout>
            {isLoading ? <ActivityIndicator/> :
            <View style={{ height: bodyHeight * 0.93 }}>
                <View>
                    <Text style={{ textAlign: 'center', fontWeight: '900', fontSize: baseFontSize * 5 }}>
                        
                        {messages['community_details']['community_name']}

                    </Text>
                </View>
                <FlatList ref={messageListRef} data={messages['msg_list']} renderItem={({ item }) =>
                    <>
                        <View style={{ padding:bodyHeight/50, backgroundColor: item['same'] ? 'orange' : 'blue', width:bodyWidth/2, alignSelf: item['same'] ? 'flex-end' : 'flex-start', margin:bodyHeight/100, borderRadius:bodyHeight/50, borderTopLeftRadius: item['same'] && 0, borderTopRightRadius: !item['same'] && 0  } }>
                            <Text style={{ color: 'white', fontWeight: '900', fontSize : baseFontSize *4 }}>
                                {item['sender']}
                            </Text>
                            <Text style={{ color: 'white', fontSize : baseFontSize *3 }}>
                                {item['message']}
                            </Text>
                            <Text style={{color:'gray', fontSize : baseFontSize *2.5, marginLeft:bodyWidth/3}}>
                                {item['time_sent']}
                            </Text>
                        </View>

                    </>
                }
                
                keyExtractor={(item)=> item['id'].toString()}

                style={{height:bodyHeight/2}}/>
            </View>
}
            {
                // Text input field
            }
            <View style={{ height: bodyHeight * 0.07, width: bodyWidth, padding: height / 100 }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{ width: bodyWidth * 0.1 }}>
                        <FIcon name="image" size={baseFontSize * 5} color={'blue'} style={styles.icon} />
                    </TouchableOpacity>
                    <View style={{ width: bodyWidth * 0.8 }}>
                        <TextInput style={{ borderWidth: 1, height: bodyHeight * 0.05 }} value={text} onChangeText={setText} multiline={true} />
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
    }
})