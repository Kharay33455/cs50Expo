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

export default function Profile() {

    const [data, setData] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const navigation = useNavigation();
    const [bio, setBio] = useState('');
    const [editBio, setEditBio] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [processingBio, setProcessingBio] = useState(false);
    const [image, setImage] = useState(null);
    const [processingImage, setProcessingImage] = useState(false);
    const [editDN, setEditDN] = useState(false);
    const [newDN, setNewDN] = useState('');
    const [displayName, setDisplayName] = useState('');

    const pickNewPfp = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        if (!result.canceled) {
            setProcessingImage(true);
            setTimeout(() => {
                updatePerson('pfp', result.assets[0].uri);
            }, 1000);
        }
    }

    function logout() {
        try {
            const response = fetch('http://192.168.0.4:8000/api-person/logout');
            navigation.navigate('Posts')
        }
        catch (error) {
            console.log(error)
        }
    }

    const get_details = async () => {

        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/person?format=json');
            if (response.status === 301) {
                const errorMsg = await response.json();
                navigation.navigate('Login', { err: 'Sign in to continue', from: 'Profile' });
                return;
            }
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

    const updatePerson = async (which, path) => {
        const csrf = data['csrf']
        const form = new FormData();
        const newImage = path;
        if (which === 'bio') {
            form.append('bio', newBio);
        }

        if (which === 'pfp') {
            form.append('pfp', {
                uri: newImage,
                type: 'image/jpeg',
                name: 'pfp.jpg'

            });
        }
        if (which == 'displayName'){
            form.append('displayName', newDN);
        }
        form.append('which', which)
        try {

            const response = await fetch('http://192.168.0.4:8000/api-person/update-person',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrf,
                    },
                    body: form
                }
            );
            const res = await response.json();
            if (response.status === 200 && which === 'bio') {
                setProcessingBio(false);
            }
            if (response.status === 200 && which == 'pfp') {
                setTimeout(() => {

                    setImage(res['pfp']);
                    setProcessingImage(false);
                }, 1000)
            }
            if(response.status === 200 && which === 'displayName')
            {
                setTimeout(()=>{
                    setDisplayName(newDN);
                }, 1000);
            }

        } catch (error) {
            console.log(error);
        }
    };
    if (newDN.length > 30) {
        setNewDN(newDN.slice(0, 30))
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
                            <Image source={image !== "" ? { uri: image } : require('../images/placeholder-male.jpg')} style={processingImage ? [styles.imageBlur, styles.pfp] : styles.pfp} />
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { pickNewPfp(); }}>
                                <Icon name='edit' size={iconSize} color={'orange'} style={{ alignSelf: 'flex-end' }} />
                            </TouchableOpacity>
                            {
                                editBio ? <TouchableOpacity style={styles.bio}>
                                    <View>
                                        <TextInput multiline={true} style={styles.input} placeholder='Enter new bio' value={newBio} onChangeText={setNewBio} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => {
                                                setProcessingBio(true);
                                                setBio(newBio);
                                                setEditBio(false);
                                                updatePerson('bio', newBio);
                                            }}>
                                                <Text style={styles.changeButton}>
                                                    Change
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => {
                                                setEditBio(false);
                                            }}>
                                                <Text style={[styles.changeButton, { backgroundColor: 'red' }]}>
                                                    Close
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity> :
                                    <Text style={processingBio === false ? [styles.bio, { color: 'black' }] : [styles.bio, { color: 'gray' }]}>
                                        {bio}    <TouchableOpacity onPress={() => { setNewBio(''); setEditBio(true); }}><Icon name='edit' size={iconSize} color={'orange'} /></TouchableOpacity>
                                    </Text>}

                        </View>
                        <View style={{ marginLeft: width / 20 }}>
                            {editDN ?
                                <>

                                    <TextInput multiline={true} style={styles.input} onChangeText={newDN.length < 31 && setNewDN} value={newDN} />
                                    <View style = {{flexDirection:'row'}}>
                                        {
                                            // Close and change buttons
                                        }
                                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={()=>{
                                        updatePerson('displayName', newDN);
                                        setEditDN(false);
                                    }}>
                                        <Text style={[styles.changeButton, {alignSelf:'flex-start'}]}>Change</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={()=>{
                                        setEditDN(false);
                                    }}>
                                        <Text style={[styles.changeButton, {alignSelf:'flex-start', backgroundColor:'red'}]}>Close</Text>
                                    </TouchableOpacity>
                                    </View>
                                </>
                                :
                                <Text style={{ fontWeight: 900, fontSize: width / 20 }}>
                                    {displayName} <TouchableOpacity onPress={() => { setEditDN(true); }}><Icon name='edit' size={iconSize} color={'orange'} /></TouchableOpacity>
                                </Text>
                            }
                            <Text style={{ fontWeight: 500, fontSize: width / 25 }}>
                                @{data['name']}
                            </Text>

                        </View>
                        <TouchableOpacity onPress={() => { logout() }}>
                            <Text style={{ color: 'white', fontSize: width / 40, backgroundColor: "red", padding: width / 50, width: width / 5, textAlign: 'center', marginLeft: width / 50, borderRadius: width / 10, marginTop: width / 20 }}>Log out</Text>
                        </TouchableOpacity>
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
                                <Post opId = {item['op']} communityIsPrivate={item['community_is_private']} communnityId={item['community']} communityName={item['community_name']} isShared={item['is_shared']} allege={item['allege']} comments={item['comment_count']} id={item['post_id']} oppfp={item['op_pfp']} post={item['post']} display={item['op_display_name']} op={item['op_user_name']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} shares={item['shares']} />
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
