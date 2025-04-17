import { useState } from "react";
export default function LoginForm(){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Email:",email);
        console.log("Password:",password);
        setEmail('');
        setPassword('');
    };
    return(
        <div>
            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" required value={email} onChange={(e)=>setEmail(e.target.value)}/><br />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" required value={password} onChange={(e)=>setPassword(e.target.value)}/><br />
                </div>
                <br />
                <button>Log in</button>
            </form>
        </div>
    );
}