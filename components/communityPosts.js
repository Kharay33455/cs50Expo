import { TextInput, Text, ActivityIndicator, Image, FlatList, View, StyleSheet, Dimensions, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Post from "./post";
import Footer from "./footer";
import Top from "./top";
import Icon from "react-native-vector-icons/Entypo";
import IIcons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import FIcon from 'react-native-vector-icons/FontAwesome5'
import { baseFontSize } from "./layout";
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('screen');

export default function CPosts(props) {
    // csrf token
    const [csrf, setCsrf] = useState(null);
    // success
    const [msg, setMsg] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [err, setErr] = useState('');
    const [isMod, setIsMod] = useState(false);
    const [display, SetDisplay] = useState(false);
    // Set to false so we don't try to access values before requests are made
    const [loadingRequest, setLoadingRequest] = useState(true);
    // to manage edit box visibility
    const [showExitBox, SetShowExitBox] = useState(false);

    // for changing community name and description
    const [newCommunityName, SetNewCommunityName] = useState('');
    const [newCommunityDescription, SetNewCommunityDescription] = useState('');
    const [newCommunityPfp, SetNewCommunityPfp] = useState(null);

    // community privacy
    const [isPrivate, setIsPrivate] = useState(null)
    const navigation = useNavigation();

    const iconSize = width / 20;
    const id = props.route.params['id']
    const get = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/get-community-posts?id=' + id);
            const result = await response.json();
            if (response.status === 200) {
                setData(result);
                setIsLoading(false);
                setIsPrivate(result['community_details']['community_is_private']);
                SetNewCommunityName(result['community_details']['community_name'])
                SetNewCommunityDescription(result['community_details']['community_description'])
                SetNewCommunityPfp(result['community_details']['community_pfp']);
                setCsrf(result['csrf'])
                console.log(result);

            }

        } catch (error) {
            console.log(error);
        }
    }



    /// Exit community function 
    const exitCommunity = async (communityId) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/exit-community?communityId=' + communityId);
            if (response.status === 200) {
                navigation.navigate('MyCommunity');
            }
        } catch (error) {
            console.log(error);
        }
    };



    // itemId is requests to take action on. action can be 1 0r 0.... ie: reject or accept
    const get_requests = async (itemId, action) => {

        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/community-req?id=' + id + '&itemId=' + itemId + '&action=' + action);
            const result = await response.json();
            // user trying to accept or reject request somehow isnt mod
            if (response.status === 403) {
                setErr("You're not a moderator.");

                setTimeout(() => {
                    setErr('');
                }, 5000);
            }
            if (response.status === 200) {
                setRequests(result);
                setIsMod(true);
                SetDisplay(true);
            }

        } catch (error) {
            console.log(error);
        }
        // set false after retrieval
        finally {
            setLoadingRequest(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 1,
            allowsEditing: true
        })

        if (!result.canceled) {
            SetNewCommunityPfp(result.assets[0].uri);
        }
    };

    const changeCommunity = async () => {
        try {
            // cereated new form with all community details
            const form = new FormData();
            form.append('name', newCommunityName);
            if (newCommunityPfp) {
                form.append('pfp',
                    {
                        type: 'image/jpg',
                        name: newCommunityPfp,
                        uri: newCommunityPfp
                    }
                );
            }
            form.append('description', newCommunityDescription);
            form.append('isPrivate', isPrivate);
            form.append('communityId', data['community_details']['community_id']);

            // send data
            const response = await fetch('http://192.168.0.4:8000/api-person/change-community-details',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrf,
                    },
                    body: form
                }
            );
            const result = await response.json();

            if (response.status === 200){
                setMsg(result['msg'])
                setTimeout(()=>{
                    setMsg('');
                    setErr('');
                }, 3000);
            }


        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        get();
    }, []);


    newCommunityName && newCommunityName.length > 50 && SetNewCommunityName(newCommunityName.slice(0, 50));
    newCommunityDescription && newCommunityDescription.length > 1000 && SetNewCommunityDescription(newCommunityDescription.slice(0, 1000));




    return (
        <>



            <View style={{ display: display ? 'flex' : 'none', position: 'absolute', top: width / 8, width: width, backgroundColor: 'white', zIndex: 2 }}>

                {
                    // close button
                }
                <TouchableOpacity onPress={() => {
                    SetDisplay(false);
                }}>
                    <View style={{ flexDirection: 'row-reverse', width: width, padding: width / 50 }}>
                        <View style={{ width: width / 10 }}>
                            <Icon name="circle-with-cross" size={iconSize} />
                        </View>
                    </View>
                </TouchableOpacity>


                <Text style={{ textAlign: 'center', color: "red", fontSize: width / 30, fontWeight: '900' }}>{err}</Text>
                {

                    loadingRequest ? <ActivityIndicator /> :

                        requests['join_requests'].length === 0 ?
                            <View>
                                <Text style={{ fontSize: width / 10, textAlign: 'center' }}>No pending requests</Text>
                            </View> :
                            <FlatList data={requests['join_requests']} renderItem={({ item }) =>


                                <View style={{ flexDirection: "row", justifyContent: 'space-between', padding: width / 20, }}>
                                    <View>
                                        <Text style={{ fontWeight: '900', fontSize: width / 25 }}>
                                            {item['username']}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', width: width / 6, justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => {
                                            get_requests(item['id'], 0);
                                        }}>
                                            <Text style={[styles.iconImage, { backgroundColor: 'green' }]}>
                                                <Icon name="add-user" size={iconSize} color={'white'} />
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            get_requests(item['id'], 1);
                                        }}>
                                            <Text style={[styles.iconImage, { backgroundColor: 'red' }]}>
                                                <Icon name="remove-user" size={iconSize} color={'white'} />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            } />
                }
                <View style={{ padding: width / 20 }}>
                <Text style={{textAlign:'center', fontWeight:'900', color:"green"}}>{msg}</Text>
                    <TextInput style={styles.textInput} placeholder="Change community name" value={newCommunityName} onChangeText={SetNewCommunityName} />
                    <TextInput style={styles.textInput} placeholder="Change description" value={newCommunityDescription} onChangeText={SetNewCommunityDescription} />
                    <TouchableOpacity onPress={() => {
                        isPrivate ? setIsPrivate(false) : setIsPrivate(true)
                    }}>
                        {
                            // edit privacy

                            isPrivate ?
                                <>
                                    <FIcon name="toggle-on" color={'orange'} size={iconSize} />
                                    <Text style={{ color: 'blue' }}>Community is private</Text>
                                </> :
                                <>
                                    <FIcon name="toggle-off" color={'gray'} size={iconSize} />
                                    <Text style={{ color: 'blue' }}>Community is public</Text>
                                </>
                        }
                    </TouchableOpacity>
                    {
                        // change profile picture
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    pickImage();
                                }}
                            >
                                <Text style={{ fontWeight: '900', color: 'orange' }}>
                                    Community profile picture
                                </Text>
                                <Image source={newCommunityPfp ? { uri: newCommunityPfp } : require('../images/group.png')} style={{ width: baseFontSize * 20, height: baseFontSize * 20 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                SetNewCommunityPfp(null);
                            }}>
                                <Text style={{ backgroundColor: "red", width: width / 4, color: "white", fontWeight: '900', textAlign: 'center', margin: width / 50, padding: width / 100, borderRadius: width / 4 }}>
                                    Clear
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View>
                        <TouchableOpacity style={{ width: width / 4, alignSelf: 'flex-end' }}
                            onPress={() => {
                                changeCommunity();
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: '900', backgroundColor: 'orange', alignSelf: 'flex-end', width: width / 4, padding: width / 100, textAlign: "center", borderRadius: width / 4 }}>

                                Submit change
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>



            {
                isLoading ? <ActivityIndicator />
                    :
                    <>
                        <View style={{ marginBottom: height / 5 }}>

                            <SafeAreaView style={styles.safe}>
                                <StatusBar barStyle="dark-content" />
                                <View style={styles.top}>
                                    <Top uri={data['user_pfp']} />

                                </View>
                            </SafeAreaView>
                            <View style={styles.head}>

                                <TouchableOpacity style={styles.active}>
                                    <Text>
                                        {data['community_details']['community_name']}
                                    </Text>
                                </TouchableOpacity>
                            </View>


                            {isLoading ? <ActivityIndicator /> : data['isMod'] === true &&
                                <TouchableOpacity onPress={() => {
                                }}>
                                    <View style={{ textAlign: 'center' }}>
                                        <Text style={{ textAlign: 'center' }}>
                                            <TouchableOpacity>

                                                <IIcons name="settings" size={iconSize} color={'orange'} onPress={() => {
                                                    get_requests(0, 0);
                                                }} />
                                            </TouchableOpacity>

                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }

                            {data['community_details']['community_description'] &&
                                <Text style={{ padding: iconSize }}>
                                    {data['community_details']['community_description']}
                                </Text>
                            }

                            {
                                data['notMember'] && <Text style={{ fontWeight: '900', padding: iconSize / 2 }}>You are not a member of this community so you can only see posts available to the public.</Text>
                            }
                            {data['length'] === 0 ? <Text style={{ fontWeight: '900', textAlign: 'center', fontSize: width / 20 }}>NO POSTS YET</Text> :

                                <>

                                    <FlatList data={data['post_list']} renderItem={({ item }) =>
                                        <Post userId={data['user_id']} opId={item['op_id']} communityIsPrivate={data['community_details']['community_is_private']} communityName={data['community_details']['community_name']} communityId={id} isShared={item['is_shared']} id={item['id']} oppfp={item['oppfp']} post={item['post']} display={item['display']} op={item['op']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} comments={item['comments']} shares={item['shares']} allege={item['allege']} />
                                    } />
                                </>

                            }
                        </View>
                    </>
            }
            <View style={styles.bottom}>
                <Footer active="people-group" />
            </View>

            {!isLoading && !data['notMember'] &&
                <>
                    <TouchableOpacity style={{ position: 'absolute', bottom: height / 5, width: width / 6, right: 0 }}
                        onPress={() => {
                            SetShowExitBox(true);
                        }}
                    >
                        <Text>
                            <IIcons name="exit" size={iconSize * 2} style={{ color: 'orange' }} />
                        </Text>
                    </TouchableOpacity>

                    <View style={showExitBox ? styles.exitBox : [styles.exitBox, { display: 'none' }]}>
                        <View style={{ width: width / 1.5, backgroundColor: 'orange', padding: width / 20, borderRadius: width / 20 }}>
                            <Text style={{ color: 'white', fontSize: width / 25, fontWeight: '900' }}>
                                You're about to exit "{!isLoading && data['community_details']['community_name']}"", are you sure you want to proceed with this action?
                            </Text>
                            <Text style={{ color: 'blue', fontSize: width / 35, fontWeight: '900' }}>
                                If this community is private, an moderator would have to approve your request to rejoin.
                            </Text>
                            <View style={{ flexDirection: 'row', width: width / 3, justifyContent: 'space-evenly', alignSelf: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    exitCommunity(data['community_details']['community_id']);
                                }}>
                                    <Text style={[{ backgroundColor: 'red' }, styles.button]}>
                                        Exit
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    SetShowExitBox(false);
                                }}>
                                    <Text style={[{ backgroundColor: 'blue' }, styles.button]}>
                                        Back
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </>
            }
        </>
    )
}

const styles = StyleSheet.create({
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
    iconImage:
    {
        padding: width / 100
    },
    button: {
        color: 'white', padding: width / 100, borderRadius: width / 50, fontSize: height / 50, marginTop: height / 50
    },
    exitBox:
    {
        position: 'absolute', width: width, height: height, alignContent: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)'
    },
    textInput: {
        borderWidth: 1,
        height: height / 20,
        fontWeight: '900',
        marginBottom: height / 100
    }
})