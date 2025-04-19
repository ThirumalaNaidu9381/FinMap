import user from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const generateToken=(user)=>{
    return jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'});
};
export const register=async(req,res)=>{
    const {name,email,password,role}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({message:'User already exists'});
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({name,email,password:hashedPassword,role});
        const token=generateToken(newUser);
        res.status(201).json({user:{id:newUser._id,name,email,role},token});
    }
    catch(err){
        res.status(500).json({message:'Registration failed',error:err.message});
    }
};
export const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:'Invalid credentials'});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({mesage:'Invalid credentials'});
        const token=generateToken(user);
        res.status(200).json({user:{id: user._id,name:user.name,email,role:user.role},token});
    }
    catch(err){
        res.status(500).json({message:'Login failed',error:err.message});
    }
};