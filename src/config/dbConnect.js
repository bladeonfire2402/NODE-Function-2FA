import mongoose from "mongoose";
import 'dotenv/config'

const DBconnect = async()=>{
    try{
        const URI=process.env.MONGO_URI;
        const connect = await mongoose.connect(URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    
        if(!connect){
            throw new Error("Failed! ")
        }

        console.log("Kết nối DB thành công rồi !");
    }
    catch(e){
        console.log("Không kết nối được DB")
    }
}
export default DBconnect