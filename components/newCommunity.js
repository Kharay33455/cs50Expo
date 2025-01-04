// Add new community function
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Footer from "./footer"
import Icon from "react-native-vector-icons/FontAwesome"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"

// get dimensions
const { width, height } = Dimensions.get('window')

export default function NewCommunity() {

    // track private option on form
    const [isPrivate, setIsPrivate] = useState(false);
    // track community name. max length is 30
    const [name, setName] = useState('');
    // track description
    const [description, setDescription] = useState('');

    // csrf token to append to user post request
    const [csrf, setCsrf] = useState('');

    //error display
    const [err, setErr] = useState('');

    // navigation object 
    const navigation = useNavigation();



    // check if user is trying to exceed 30 values 
    if (name.length > 50) {
        setName(name.slice(0, 50));
    };

    if (description.length > 1000) {
        setDescription(description.slice(0, 1000));
    };

    const createCommunity = async()=>{
        const form = new FormData();
        form.append('name', name);
        form.append('isPrivate', isPrivate);
        form.append('description', description);
        console.log(csrf);
        try{
            const response = await fetch('http://192.168.0.4:8000/api-person/new-community',
                {
                    method : 'POST',
                    headers:{
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrf
                    },
                    body:form
                }
            
            );
            const result = await response.json();
            console.log(result);
            if (response.status === 400){
                setErr('Name cannot be blank')
            }
            if (response.status === 200){
                navigation.navigate('CPosts', {id: result['id']});
            }
        }catch(error){
            console.log(error);
        }
    }

    const getCsrf = async()=>{
        try{
            const resp = await fetch('http://192.168.0.4:8000/api-person/new-community');
            const result = await resp.json();
            setCsrf(result['csrf']);

        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getCsrf();
    }, []);



    return (
        <>
            <View style={{ padding: width / 40, margin: width / 40 }}>
                <ScrollView>
                    <View style={{ alignSelf: 'center' }}>
                        {
                            // Error display if any
                        }
                        <Text style={{textAlign:'center', fontWeight:'900', color:'red'}}>
                            {err}
                        </Text>
                        {
                            // Welcom text
                        }
                        <Text>
                            Welcome to Communities! Here, you can create new communities and choose to make them either private or public. Private communities require approval from a moderator to join, while public communities allow users nearby to join and post without needing your permission.
                        </Text>
                        <View style={{ marginTop: height / 20 }}>
                            {
                                // Community name.
                                // Show character limits for community
                            }
                            <Text style={styles.title}>Community Name:</Text>
                            <TextInput onChangeText={setName} value={name} style={{ height: height / 20, borderBottomWidth: 1, borderColor: 'gray', fontSize: height / 60 }} multiline={true} placeholder="Enter new community name" />
                            <Text>{name.length}/50</Text>
                            <Text style={{ color: 'blue' }}>Community name can only be alphanumeric. Do not use symbols.</Text>

                            {
                                // Change look and help text based on option
                            }
                            <Text style={styles.title}>
                                Privacy:

                            </Text>

                            <TouchableOpacity onPress={() => {
                                isPrivate ? setIsPrivate(false) : setIsPrivate(true);
                            }}>

                                <Icon name={isPrivate ? 'toggle-on' : 'toggle-off'} size={width / 10} style={{ color: isPrivate ? 'orange' : 'gray' }} />
                            </TouchableOpacity>
                            <Text style={{ color: 'blue' }}>
                                {isPrivate ? 'In private communities, people must request and receive your approval to join.' : 'Anyone can join and post in public communities without needing your approval.'}
                            </Text>

                            {
                                // Get new commmunity desctiption
                                // show how many values remain to exhause character limit for descrption
                            }

                            <Text style={styles.title}>
                                Description:
                            </Text>
                            <TextInput value={description} onChangeText={setDescription} style={{ height: height / 7, borderBottomWidth: 1, borderColor: 'gray', fontSize: height / 60 }} multiline={true} placeholder="What's happening here?" />
                            <Text>{description.length}/1000</Text>
                            <TouchableOpacity onPress={()=>{
                                createCommunity();
                            }}>

                                {
                                    // Join button
                                }
                                <Text style={{ textAlign: 'center', padding: height / 50, backgroundColor: 'orange', alignSelf: 'center', margin: height / 50, color: 'white', fontWeight: '900', fontSize: height / 50, borderRadius: width / 10, paddingLeft: width / 5, paddingRight: width / 5 }}>
                                    Join
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
            <View style={styles.bottom}>
                <Footer active="people-group" />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    title:
    {
        fontWeight: '900', fontSize: height / 50, marginTop: height / 50
    }

});