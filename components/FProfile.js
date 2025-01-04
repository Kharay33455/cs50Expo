import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, View, Image, SafeAreaView, ActivityIndicator, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Top from './top';
import { use, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Post from './post';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();

const iconSize = width / 20;

export default function FProfile(props) {

    const [data, setData] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const navigation = useNavigation();
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const parameters = props.route.params || {};
    const userId =  parameters['id'];

    const [displayName, setDisplayName] = useState('');



    const get_details = async () => {
        console.log('Fetching details')

        try {
            // Get all details from back end for selected user by their ID.
            const response = await fetch('http://192.168.0.4:8000/api-person/person?userId='+userId);
            if (response.status === 301) {
                navigation.navigate('Login', { err: 'Sign in to continue', from: 'Profile' });
                return;
            }
            if (response.status === 302){
                navigation.navigate('Profile');
                return;
            };
            const data = await response.json();
            setData(data);
            setBio(data['bio']);
            setDisplayName(data['display_name']);
            data['pfp'] && setImage(data['pfp']);
        }
        catch (error) {
            console.error(error)
        } finally {
            setIsloading(false);
        }
    }

    useEffect(() => {
        get_details();
    }, [])



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />
            </SafeAreaView>

            {isLoading ? <ActivityIndicator /> :
                <>
                    <View style={{ paddingBottom: height / 2 }}>
                        <View style={styles.post}>
                            <Image source={image !== "" ? { uri: image } : require('../images/placeholder-male.jpg')} style={styles.pfp} />
                   
                            
                                    <Text style={styles.bio}>
                                        {bio}  
                                    </Text>

                        </View>
                        <View style={{ marginLeft: width / 20 }}>
                            
                                
                                <Text style={{ fontWeight: 900, fontSize: width / 20 }}>
                                    {displayName}
                                </Text>
                            
                            <Text style={{ fontWeight: 500, fontSize: width / 25 }}>
                                @{data['name']}
                            </Text>

                        </View>
                 
                        <View style={[styles.post, { justifyContent: 'space-around', paddingTop: width / 20 }]}>
                            <Text style={styles.fontSizing}>23 Fans</Text>
                            <Text style={styles.fontSizing}>9 Obsessions</Text>
                            <Text style={styles.fontSizing}>10 Stalkers</Text>
                        </View>
                        <View>
                            <Text style={styles.posts}>Posts</Text>
                        </View>
                        <View style={styles.listPad}>
                            <FlatList data={data['post']} renderItem={({ item }) =>
                                <Post opId = {null} communityIsPrivate={item['community_is_private']} communnityId={item['community']} communityName={item['community_name']} isShared={item['is_shared']} allege={item['allege']} comments={item['comment_count']} id={item['post_id']} oppfp={data['pfp']} post={item['post']} display={data['display_name']} op={data['name']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} shares={item['shares']} />
                            } />
                        </View>
                    </View>
                </>
            }


            <View style={styles.bottom}>
                <Footer />
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
        flexDirection: 'row'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    input: {
        borderColor: 'black',
        height: height / 20,
        borderBottomWidth: 2,
        width: width / 2,
        borderRadius: width / 100,
        borderStyle: 'dotted',

    },
    bio: {
        fontSize: width / 40,
        fontWeight: '900',
        position: 'absolute',
        width: width / 1.5,
        right: width / 100,
        bottom: height / 50
    },
    fontSizing: {
        fontSize: width / 20
    },
    posts:
    {
        textAlign: 'center',
        fontSize: width / 10,
        borderBottomColor: 'orange',
        borderBottomWidth: height / 100,
        borderTopColor: 'orange',
        borderTopWidth: height / 100
    },
    listPad: {
        paddingBottom: height / 2.8
    },
    changeButton: {
        backgroundColor: 'orange',
        color: 'white',
        padding: width / 100,
        margin: width / 100,
        borderRadius: width / 50
    },
    imageBlur: {
        opacity: 0.5
    },
    pfp: {
        width: width / 4, height: height / 7, borderRadius: width / 5
    }
});
