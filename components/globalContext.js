import { createContext, useState } from "react";

export const GeneralContext = createContext();


export const GeneralContextProvider = ({ children }) => {
    // store active screen
    const [screen, setScreen] = useState('globe-africa');

    // chat list
    const [chatList, setChatList] = useState([]);
    const [isRead, setIsRead] = useState([]);

    const [socket, setSocket] = useState(null);

    const [msgCount, setMsgCount] = useState(0);

    const [signedIn, setSignedIn] = useState(false);


    /*
    SOCKET IMPLEMENTATION
    */

    // re_path to connect to
    const url = 'ws://192.168.0.4:8000/ws/chat-list/'
    const chatSocket = () => {
        // web socket object initialization
        const globalWS = new WebSocket(url);
        try {

            // web socket open
            globalWS.onopen = () => {
                console.log("Web socket open");
                // set socket
                setSocket(globalWS);
            }

            // on receive from server 
            globalWS.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log(data);
                data['type'] === 'connection_established' && setMsgCount(data['unread']);
                // check signal type and take action
                data['type'] === 'new_message_signal' && setMsgCount(data['unread']);
            }

            // web closing
            globalWS.onclose = () => {
                // when socket closes, set socket to null. This tells app to restart socket on load
                console.log("Websocket closing...");
                setSocket(null);
            }





        } catch (error) {
            console.error(error);
        }
    }
    console.log('msg ciount = ', msgCount);

    // auto connect in case of unsuspected misconnection
    if (socket === null && signedIn) {
        chatSocket();
    }
    console.log('socket is ', socket);

    // store chat list
    return (
        <GeneralContext.Provider value={{ screen, setScreen, chatList, setChatList, isRead, setIsRead, socket, setSocket, msgCount, setSignedIn }}>
            {children}
        </GeneralContext.Provider>
    )
}