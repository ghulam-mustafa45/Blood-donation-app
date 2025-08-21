// name, email, password, bloodType, city, contactInfo
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    bloodType:{
        type:String,
    },
    city:{
        type:String,
        required:true,
    },
    contactInfo:{
        type:String,
    },
    role:{
        type:String,
        required:true,
    }
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.generateToken=async function(){
    try {
       return jwt.sign(
        {
            userId:this._id.toString(),
            email:this.email,
            name:this.name,
            bloodType:this.bloodType,
            city:this.city,
            contactInfo:this.contactInfo,
            role:this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"30d"
        }
    );
    } catch (error) {
        console.log(error);
    }
};
const User=mongoose.model("User",userSchema);
export default User;