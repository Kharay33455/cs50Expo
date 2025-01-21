import { createContext, useState } from "react";

export const GeneralContext = createContext();


export const GeneralContextProvider = ({ children }) => {
    // store active screen
    const [screen, setScreen] = useState('globe-africa');
    // store chat list
    return (
        <GeneralContext.Provider value={{ screen, setScreen }}>
            {children}
        </GeneralContext.Provider>
    )
}