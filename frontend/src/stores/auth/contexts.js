import { createContext } from 'react';

export const AuthStateContext = createContext(null);
export const AuthDispatchContext = createContext(null);

// Prinzip von create und useContext
// <AuthStateContext.Provider value={message}>
// <>
// const message = useContext(AuthStateContext);
// console.log(message);
// </>
//</AuthStateContext.Provider>
