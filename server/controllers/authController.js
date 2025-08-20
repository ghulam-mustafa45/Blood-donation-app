import User from "../models/User.js";
import bcrypt from "bcryptjs";

const home=async(req,res)=>{
    try {
        res.send("Login Page 🚀");
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

}



const register=async(req,res)=>{
    try {
         const {name,email,password,bloodType,city,contactInfo}=req.body;
         console.log(name,email,password,bloodType,city,contactInfo);
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                message:"User Already Exists"
            })
        }

        const user=await User.create({name,email,password,bloodType,city,contactInfo});
        res.status(201).json({
            message:"User Registered Successfully",
            user,
            token:await user.generateToken(),userId:user._id.toString()
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);   
        if(!isPasswordCorrect){
            return res.status(400).json({
                message:"Invalid Password"
            })
        }
        res.status(200).json({
            message:"Login Successfully",
            user,
            token:await user.generateToken(),userId:user._id.toString()
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export { home, register, login };