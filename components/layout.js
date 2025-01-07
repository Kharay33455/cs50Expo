// all imports
import { Dimensions, StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import React from 'react';

// user screen dimension
const { width, height } = Dimensions.get('window');

const iosBar = Platform.OS  === 'ios' ? height/20 : 0
const androidBar = Platform.OS === 'android' ? height/40 : 0 
// height of body section of screen
export const bodyHeight = height - height / 20 - height / 15 - height / 50 - height / 50 - iosBar - androidBar;

// origin of all fonts. All font sizes are mathematical functions of this number. Change this to change all font size
export const baseFontSize = width/100

export const bodyWidth = width - (2 * width/100);

export default function Layout({children}) {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark-content" />
            <View style={styles.top}>
                <Top />
            </View>
    
            <View style={{ height: bodyHeight, paddingLeft:width/100, paddingRight:width/100 }}>

                {React.Children.map(children, child=>
                    React.cloneElement(child, {bodyHeight : bodyHeight, baseFontSize : baseFontSize})
                )}

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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    bottom: {
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    },

});
