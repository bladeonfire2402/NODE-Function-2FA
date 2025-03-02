import mongose from 'mongoose'


const userVerificationModel = mongose.Schema({
    userId:{type:String,required:true,},
    uniqueString:{type:String,required:true,},
    createAt:{type:Date,default:Date.now()},
    expriedAt:{type:Date,default:Date.now()+5*60*1000}
})

export default mongose.model("userVerification",userVerificationModel)