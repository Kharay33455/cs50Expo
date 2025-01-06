import { Text, ActivityIndicator, FlatList, View, StyleSheet, Dimensions, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Post from "./post";
import Footer from "./footer";
import Top from "./top";
import Icon from "react-native-vector-icons/Entypo";
import IIcons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('screen');

export default function CPosts(props) {
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
                console.log(result);
            }

        } catch (error) {
            console.log(error);
        }
    }



    /// Exit community function 
    const exitCommunity = async (communityId) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/exit-community?communityId='+communityId);
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
    }

    useEffect(() => {
        get();
    }, []);
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
                                    get_requests(0, 0);
                                }}>
                                    <View style={{ textAlign: 'center' }}>
                                        <Text style={{ textAlign: 'center' }}>
                                            Incoming group requests:
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

{ !isLoading &&  !data['notMember'] &&
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
                    <Text style={{color: 'blue', fontSize: width / 35, fontWeight: '900'}}>
                        If this community is private, an moderator would have to approve your request to rejoin.
                    </Text>
                    <View style={{ flexDirection: 'row', width: width / 3, justifyContent: 'space-evenly', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            exitCommunity(data['post_list'][0]['community']);
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
    }
})