import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Image, TextInput, Text, View, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, FlatList, Platform, Keyboard } from 'react-native';
import Footer from './footer';
import Top from './top';
import { useEffect, useState } from 'react';
import Post from './post';
import Comment from './comment';

const { width, height } = Dimensions.get('window');



export default function PostE(props) {
    const id = props.route.params['id'] || 1

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const [comments, setComments] = useState([])
    const [commentCount, setCommentCount] = useState(0)
    const [loadedComments, setLoadedComments] = useState(false)

    // Function to send message 
    const sendComment = async (text) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/comment?comment=' + text + '&postId=' + id);
            const results = await response.json();
            setComments(results['comments'])
            setCommentCount(results['comment_count'])
            setLoadedComments(true);

        } catch (error) {

        }
    }

    const fetch_post = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/post_extension?postId=' + id);
            const result = await response.json();
            setIsLoading(false)
            setData(result)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetch_post();
        sendComment('');
    }, []);


    return (

        <SafeAreaView style={styles.container}>

            <StatusBar style="auto" />
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.top}>
                    {isLoading ?
                        <Top /> : <Top uri={data['user_pfp']} />}
                </View>
            </SafeAreaView>
            <View style={styles.post}>
                {isLoading ? <ActivityIndicator /> :
                    <>
                        <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'position' : 'height'}>

                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <ScrollView>


                                    <Post opId = {data['post']['op']} userId= {data['user_id']} interact = {true} communityIsPrivate = {props.route.params['communityIsPrivate']} communityName = { data['community_name'] ? data['community_name'] :  props.route.params['communityName']} communityId = {props.route.params['communityId']} isShared={data['post']['is_shared']} id={id} oppfp={data['post']['op_pfp']} post={data['post']['post']} display={data['post']['op_display_name']} op={data['post']['op_username']} media1={data['post']['media1']} likes={data['post']['likes']} frowns={data['post']['frowns']} ghost_likes={data['post']['ghost_likes']} comments={loadedComments ? commentCount : 0} shares={data['post']['shares']} allege={data['post']['allege']} />
                                    {data['post']['media2'] && <Image source={{ uri: data['post']['media2'] }} style={styles.image} />}
                                    {data['post']['media3'] && <Image source={{ uri: data['post']['media3'] }} style={styles.image} />}
                                    {data['post']['media4'] && <Image source={{ uri: data['post']['media4'] }} style={styles.image} />}
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput placeholder='Send new message' style={styles.input} onChangeText={setText} value={text} />
                                        <TouchableOpacity onPress={() => {
                                            sendComment(text);
                                            setText("");
                                        }}>
                                            <Text style={styles.send}>
                                                Send
                                            </Text>
                                        </TouchableOpacity>
                                    </View>


                                    {
                                        loadedComments ?
                                            comments.map((comment) => <Comment key={comment['id']} comment={comment} />)
                                            : <Text></Text>}

                                </ScrollView>

                            </TouchableWithoutFeedback>

                        </KeyboardAvoidingView>

                    </>
                }
            </View>
            <View style={styles.bottom}>
                <Footer active="" />
            </View>
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
        paddingBottom:height/5
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
        borderColor: 'orange',
        height: height / 20,
        borderWidth: height * 3 / width,
        width: width / 1.4,
        fontSize: width / 30,
        borderRadius: width / 10,

    },
    image: {
        width: width / 1.2,
        height: height / 1.5,
        marginBottom: height / 100
    },
    send: {
        fontSize: width / 30,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        padding: width / 50,
        paddingLeft: width / 20,
        paddingRight: width / 20,
        borderRadius: width / 10,
        marginLeft: width / 50
    }
});