import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, ActivityIndicator, FlatList, View, SafeAreaView, Text } from 'react-native';
import Top from './top';
import Post from './post';
import Footer from './footer';
import { useEffect, useState } from 'react';



const { width, height } = Dimensions.get('window');


export default function Posts() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const controller = new AbortController();
    const { signal } = controller


    const getPosts = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/?format=json', { signal })
            const result = await response.json()
            setData(result);
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        getPosts();

        return ()=>{
            controller.abort();
        }
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
     

            <View style={styles.post}>
                {
                    isLoading ? <ActivityIndicator /> : 
                    <>
                    <SafeAreaView style={styles.safe}>
                    <StatusBar barStyle="dark-content" />
                      <View style={styles.top}>
                        <Top uri = {data['user_data']['pfp']} />
                        
                    </View>
                    </SafeAreaView>
                    <FlatList data={data['posts']} renderItem={({ item }) =>
                        <Post userId = {data['user_data']['id']} opId = {item['op_id']} communityIsPrivate = {item['community_is_private']} communityName = {item['community_name']} communityId = {item['community']} isShared = {item['is_shared']} id={item['post_id']} oppfp = {item['oppfp']} post={item['post']} display={item['display']} op={item['op']} media1={item['media1']} likes={item['likes']} frowns = {item['frowns']} ghost_likes = {item['ghost_likes']} comments = {item['comments']} shares = {item['shares']} allege={item['allege']} />
                    } />
                    </>
                }
          
            </View>

            <View style={styles.bottom}>
                <Footer active="globe-africa" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    top: {
        paddingLeft: width / 20,
        paddingRight: width / 20,
        paddingTop: width / 100,
        paddingBottom: width / 100
    },
    post: {
        paddingLeft: width / 50,
        paddingRight: width / 50,
        paddingBottom: height/5,
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
});
