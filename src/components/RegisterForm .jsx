import { useState } from "react";
export default function RegisterForm(){
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [role,setRole]=useState('borrower');
    const handleSubmit=(e)=>{
        e.preventDefault();
        const userData={name,email,password,role};
        console.log("Registering user:",userData);
        setName('');
        setEmail('');
        setPassword('');
        setRole('borrower');
    };
    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} required onChange={(e)=>{setName(e.target.value)}} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} required onChange={(e)=>{setEmail(e.target.value)}} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} required onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role}  onChange={(e)=>{setRole(e.target.value)}}>
                        <option value="lender">Lender</option>
                        <option value="borrower">Borrower</option>
                    </select>
                </div>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}