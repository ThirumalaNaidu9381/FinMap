import { set } from "mongoose";
import {createContext,useContext,useEffect,useState} from "react";
const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [token,setToken]=useState('');
    useEffect(()=>{
        const savedToken=localStorage.getItem('token');
        const savedUser=localStorage.getItem('user');
        if(savedToken && savedUser){
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    },[]);
    const logout=()=>{
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };
    return(
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth=()=>useContext(AuthContext);