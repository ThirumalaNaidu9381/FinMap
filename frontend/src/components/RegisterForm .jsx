import { useState,useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
export default function RegisterForm(){
    const [formData,setFormData]=useState({name:'',email:'',password:''});
    const [msg,setMsg]=useState('');
    const navigate=useNavigate();
    const {user,login}=useAuth();
    useEffect(()=>{
        if (user) {
           if(user.role==='lender') navigate('/lender-dashboard');
           else if(user.role==='borrower') navigate('/borrow-dashboard');
        }
    },[user]);
    const handleChange=(e)=>{
        setForm({...form,[e.target.value]:e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('/api/register',formData);
            const {token,user}=res.data;
            login(user,token);
        }
        catch(err){
            setMsg(err.response?.data?.message || 'Registration failed');
        }
    };
    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                    <input value={formData.name} onChange={(e)=> setFormData({...formData,name: e.target.value})} placeholder="Name"/><br />
                    <input value={formData.email} onChange={(e)=> setFormData({...formData,email: e.target.value})} placeholder="Email" /><br />
                    <input type="password" value={form.password} onChange={(e)=> setFormData({...formData,password: e.target.value})} placeholder="Password" /><br />
                    {/* <select value={role}  onChange={handleSubmit}>
                        <option value="lender">Lender</option>
                        <option value="borrower">Borrower</option>
                    </select> */ */}
                {/* {/* <br /> */}
                <button type="submit">Register</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}