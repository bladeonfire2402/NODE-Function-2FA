import mongoose from "mongoose";

const userModel = mongoose.Schema({
    userName:{type:String,required:true,},
    pwd:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    verified:{type:Boolean,default:false}
})

export default mongoose.model("User",userModel)