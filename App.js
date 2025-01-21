import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Posts from './components/posts';
import Search from './components/search';
import Sresults from './components/sresults';
import Explore from './components/community';
import MyCommunity from './components/my-community';
import Alert from './components/alert';
import Dms from './components/dms';
import Cms from './components/cms';
import Profile from './components/profile';
import Login from './components/login';
import PostE from './components/postE';
import CPosts from './components/communityPosts';
import Messages from './components/messages';
import NewPost from './components/newPost';
import Register from './components/register';
import FProfile from './components/FProfile';
import NewCommunity from './components/newCommunity';
import CMessages from './components/communityMessages';
import { GeneralContext, GeneralContextProvider } from './components/globalContext';
import { useContext, useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

// re_path to connect to
const url = 'ws://192.168.0.4:8000/ws/chat-list/'

// web socket object initialization
export const globalWS = new WebSocket(url);

export default function App() {
  const [chatList, setChatList] = useState(null);
  // set up chat socket to disconnect only on app close
  const chatSocket = () => {
    try {
      // web socket open
      globalWS.onopen = () => {
        console.log("Web socket open");
      }

      // on receive from server 
      globalWS.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        setChatList([data,data,data]);
      }

      // web closing
      globalWS.onclose = () => {
        console.log("Websocket closing...");
      }


    } catch (error) {
      console.error(error);
    }
  }

  // websocket for app
  useEffect(() => {
    chatSocket();
  }, []);

  return (

      <GeneralContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Posts'>
            <Stack.Screen name='Posts' component={Posts} options={{ headerShown: false }} />
            <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
            <Stack.Screen name='Sresults' component={Sresults} options={{ headerShown: false }} />
            <Stack.Screen name='Explore' component={Explore} options={{ headerShown: false }} />
            <Stack.Screen name='MyCommunity' component={MyCommunity} options={{ headerShown: false }} />
            <Stack.Screen name='Alert' component={Alert} options={{ headerShown: false }} />
            <Stack.Screen name='Dms' component={Dms} options={{ headerShown: false }} initialParams={{items:chatList}}/>
            <Stack.Screen name='Cms' component={Cms} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='PostE' component={PostE} options={{ headerShown: false }} />
            <Stack.Screen name='CPosts' component={CPosts} options={{ headerShown: false }} />
            <Stack.Screen name='Messages' component={Messages} options={{ headerShown: false }} />
            <Stack.Screen name='New Post' component={NewPost} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
            <Stack.Screen name='FProfile' component={FProfile} options={{ headerShown: false }} />
            <Stack.Screen name='New Community' component={NewCommunity} options={{ headerShown: false }} />
            <Stack.Screen name='CMessages' component={CMessages} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </GeneralContextProvider>
  );
}
