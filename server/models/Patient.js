import mongoose from "mongoose";

const patientSchema= new mongoose.Schema({
    patientName:{
        type:String,
        required:true
    },
    bloodType:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    hospital:{
        type:String,
    },
    details:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    }

})

const Patient=mongoose.model("Patient",patientSchema);
export default Patient;