import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, TextInput, View, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Sresults from './sresults';
import Top from './top';
import Layout, { bodyHeight, bodyWidth, baseFontSize } from './layout';
import { GeneralContext } from './globalContext';
import SCommunity from './community/singleCommunity';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Search(props) {

    const navigation = useNavigation();
    const { socket } = useContext(GeneralContext);









    const SearchBox = () => {
        const [search, setSearch] = useState('');


        return (
            <View style={styles.post}>
                <TextInput style={styles.input} onChangeText={(text)=>{
                    setSearch(text)
                }} value={search} placeholder='Search' />
                <TouchableOpacity onPress={() => {
                    console.log(search);
                    socket.send(JSON.stringify({ 'message': 'search', 'value': search }));
                }}>
                    <Icon name='search' size={width / 15} style={{ paddingLeft: (width * 0.16) / 4 }} />
                </TouchableOpacity>
            </View>
        )
    }





    // search result
    const SResult = () => {
        const { sResult } = useContext(GeneralContext);

        return (
            <ScrollView>
                {
                    sResult.length === 0 ? <Text style={{textAlign:'center', fontSize: baseFontSize *7}}>No matching result</Text> :
                    sResult.map((item) => <SCommunity isPrivate={item['is_private']} id={item['comm_id']} creator={item['creator']} name={item['name']} communityPfp={item['pfp']} /> )
                }
            </ScrollView>
        )
    }









    return (
        <>
            <Layout>
                <View style={{ height: bodyHeight }}>
                    <SearchBox />
                    <SResult />
                </View>
            </Layout>
        </>
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
        borderStyle: 'solid',
        borderColor: 'black',
        height: height / 20,
        borderWidth: 1,
        width: width / 1.2
    }
});
