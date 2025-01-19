import { createContext, useState } from "react";

export const GeneralContext = createContext();

export const GeneralContextProvider = ({children})=>{

    const [screen, setScreen] = useState('globe-africa');
    
    return (
        <GeneralContext.Provider value={{screen, setScreen}}>
            {children}
        </GeneralContext.Provider>
    )
}