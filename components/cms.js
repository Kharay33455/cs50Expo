// all imports
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import { useEffect, useState } from 'react';
import Layout, { bodyHeight } from './layout';
// user screen dimension
const { width, height } = Dimensions.get('window');
// height of body section of screen

// origin of all fonts. All font sizes are mathematical functions of this number. Change this to change all font size
const baseFontSize = (width * height) / 20000;

// profile image size. height, width, border radius
const imageSize = width / 10;

// A single community chat object
const SingleCommunityChat = (props) => {

    const navigation = useNavigation();

    return (
        <View>
            {
                // show community pfp and nme size by side
            }
            <TouchableOpacity onPress={()=>{
                navigation.navigate('CMessages', {commId :props.commId});
            }}>
                <View style={{ flexDirection: 'row', marginBottom: height / 50 }}>
                    <Image source={require('../images/group.png')} style={styles.image} />
                    {
                        // give small spacing between text border
                        // set community name display font size to base font size divided by 1.5
                    }
                    <View style={{ flexDirection: 'column', padding: width / 50 }}>
                        <Text style={{ fontSize: baseFontSize / 1.5, fontWeight: '900' }}>
                            {props.name}
                        </Text>
                        <Text>

                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const CommunityChat = () => {
    const navigation = useNavigation();
    // community chat list
    const [communityChatList, setCCL] = useState([]);
    // check if community is still loading
    const [loading, setLoading] = useState(true);
    const getChatList = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/community-chat');
            const result = await response.json()
            setCCL(result['comm_list']);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getChatList();
    }, []);

    return (
        <>
            {loading ? <ActivityIndicator /> :
                <>
                                <View style={styles.head}>
                
                                    <TouchableOpacity  onPress={() => { navigation.navigate('Dms') }}>
                                        <Text>
                                            Private Chats
                                        </Text>
                                    </TouchableOpacity>
                
                                    <TouchableOpacity style={styles.active} onPress={() => { navigation.navigate('Cms') }}>
                                        <Text>
                                            Community Chats
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                
                    {
                        // Entire body section. Paadding on left and right for styling
                    }
                    <View style={{ paddingLeft: width / 100, paddingRight: width / 100 }}>
                        {
                            // Make height body height to allow scroll on multiple devices
                        }
                        <View style={{ height: bodyHeight }}>
                            <View>
                                <Text style={{ fontSize: baseFontSize }}>
                                    Warning: Community chats are public. Please keep personal information, such as your address and contact details, private.
                                </Text>
                            </View>
                            {
                                // list of communities
                            }
                            <View>
                                
                                <FlatList data={communityChatList} renderItem={({ item }) => <SingleCommunityChat name={item['community_name']} commId = {item['community_id']} />} />
                            </View>
                        </View>
                    </View>
                </>
            }
        </>
    )
}

export default function Cms() {
    const navigation = useNavigation();
    
    return (
        <Layout>
                <CommunityChat />
        </Layout>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottom: {
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    },
    image:
    {
        width: imageSize, height: imageSize, borderRadius: imageSize
    }
});
