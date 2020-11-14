import {createContext} from 'react';

export const Chatcontext = createContext({
    currentUser:null,
    setcurrentUser:()=>{}
})