import { useState } from "react";
import axios from "axios";
export default function RegisterForm(){
    const [form,setForm]=useState({name:'',email:'',password:'',role:'lender'});
    const [msg,setMsg]=useState('');
    const handleChange=(e)=>{
        setForm({...form,[e.target.value]:e.target.value});
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post('/api/register',form);
            const {token,user}=res.data;
            localStorage,setItem('token',token);
            setMsg(`Registered as ${user.name} (${user.role})`);
        }
        catch(err){
            setMsg(err.response?.data?.message || 'Registration failed');
        }
    };
    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Name" value={form.name} required onChange={handleChange} /><br />
                    <input name="email" placeholder="Email" value={form.email} required onChange={handleChange} /><br />
                    <input name="password" type="password" placeholder="Password" value={form.password} required onChange={handleChange} /><br />
                    <select value={role}  onChange={handleSubmit}>
                        <option value="lender">Lender</option>
                        <option value="borrower">Borrower</option>
                    </select>
                <br />
                <button type="submit">Register</button>
            </form>
            <p>{msg}</p>
        </div>
    );
}