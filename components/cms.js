import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native';
import Top from './top';

const { width, height } = Dimensions.get('window');


export default function Cms() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.top}>
                <Top/>
                </View>
            <View style={styles.head}>


                
            <TouchableOpacity onPress={() => { navigation.navigate('Dms') }}>
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
            <View style={styles.bottom}>
                <Footer active="message" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    }
});
