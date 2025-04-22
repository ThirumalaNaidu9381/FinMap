import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
export default function LoginForm(){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [msg,setMsg]=useState('');
    const navigate=useNavigate();
    const {user,login}=useAuth();
    useEffect(()=>{
        if (user) {
           if(user.role==='lender') navigate('/lender-dashboard');
           else if(user.role==='borrower') navigate('/borrow-dashboard');
        }
    },[user]);
    const handleSubmit=(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('/api/login',{email,password});
            const {token,user}=res.data;
            login(user,token);
            navigate('/dashboard');
        }
        catch(err){
            setMsg(err.response?.data?.message || 'Login failed');
        }
    };
    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                    <input value="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required/><br />
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/><br />
                    <button type="submit">Login</button>
                <button>Log in</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}