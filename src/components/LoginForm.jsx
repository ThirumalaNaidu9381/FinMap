import { useState } from "react";
import axios from "axios";
export default function LoginForm(){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [msg,setMsg]=useState('');
    const handleSubmit=(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('/api/login',{email,password});
            const {token,user}=res.data;
            localStorage.setItem('token',token);
            setMsg(`Welcome,${user.name} (${user.role})`);
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
                <br />
                <button>Log in</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}