import { Text, ActivityIndicator, FlatList, View, StyleSheet, Dimensions, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Post from "./post";
import Footer from "./footer";
import Top from "./top";
import Icon from "react-native-vector-icons/Entypo";

const { width, height } = Dimensions.get('screen');

export default function CPosts(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [err, setErr] = useState('');
    const [isMod, setIsMod] = useState(false);
    const [display, SetDisplay] = useState(false);

    const iconSize = width / 20;
    const id = props.route.params['id']
    const get = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/get-community-posts?id=' + id);
            const result = await response.json();
            setData(result);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    const get_requests = async (itemId, action) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/community-req?id=' + id+'&itemId='+itemId+'&action=' + action);
            const result = await response.json();

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
                <FlatList data={requests['join_requests']} renderItem={({ item }) =>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', padding: width / 20, }}>
                        <View>
                            <Text style={{ fontWeight: '900', fontSize: width / 25 }}>
                                {item['username']}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', width: width / 6, justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={()=>{
                                get_requests(item['id'], 0);
                            }}>
                                <Text style={[styles.iconImage, { backgroundColor: 'green' }]}>
                                    <Icon name="add-user" size={iconSize} color={'white'} />
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>{
                                get_requests(item['id'] , 1);
                            }}>
                                <Text style={[styles.iconImage, { backgroundColor: 'red' }]}>
                                    <Icon name="remove-user" size={iconSize} color={'white'} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                } />
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


                            {data['length'] === 0 ? <Text style={{ fontWeight: '900', textAlign: 'center', fontSize: width / 20 }}>NO POSTS YET</Text> :
                                <FlatList data={data['post_list']} renderItem={({ item }) =>
                                    <Post userId = {data['user_id']} opId = {item['op_id']} communityIsPrivate={data['community_details']['community_is_private']} communityName={data['community_details']['community_name']} communityId={id} isShared={item['is_shared']} id={item['id']} oppfp={item['oppfp']} post={item['post']} display={item['display']} op={item['op']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} comments={item['comments']} shares={item['shares']} allege={item['allege']} />
                                } />}
                        </View>
                    </>
            }
            <View style={styles.bottom}>
                <Footer active="people-group" />
            </View>
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
    }
})