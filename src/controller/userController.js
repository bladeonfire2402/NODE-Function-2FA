

import userModel from "../model/userModel.js";
import userVertificationModel from "../model/userVertificationModel.js";
import { SignInValidator } from "../validator/userValidator.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'
import {v4 as uuidv4} from 'uuid'




let transporter=nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.EMAIL_ACC,
        pass:process.env.EMAIL_PASS,

    }
})

transporter.verify((error)=>{
   if(error){
    console.log(error)
   }
   else{
    console.log("Sẵn sàng để gửi email")
   }
})

class userController {
    // Đăng kí
    signUp=async(req,res)=>{
        try{
            // gán req,body bằng object có các key trên
            let {userName, pwd, email}=req.body;

            // Tạo biến chứa lỗi nếu có khi validate
            const {errors} = SignInValidator.validate(req.body)

            //Nếu có lỗi thì in ra lỗi
            if(errors){
                const error = errors.details.map(error=>error)
                console.log("Lỗi nhập liệu rồi bạn !")
                return res.status(500).json({
                    message:error.message,
                })
            }

            // Kiểm tra có người dùng bằng email
            const isUserExist= await userModel.findOne({email:email})

            //Nếu đã có người dùng
            if(isUserExist){
                return res.status(500).json({
                    message:"Đã có người đăng kí email này rồi"
                })
            }

            //Bảo mật password (Hashed)
            const hashedPassword = await bcrypt.hash(pwd,10) 

            //Tạo acc
            const user= await userModel.create({
                ...req.body,
                pwd:hashedPassword
            })

            //Bắt lỗi bất kì khi tạo
            if(!user){
                return res.status(400).json({
                    message:"Không tạo được user rồi, chắc là do mạng !!"
                })
            }

            //Ẩn pwd để tí return
            user.pwd=undefined

            return res.status(201).json({
                message:"Đăng kí thành công",
                user
            })
        }
        catch(e){
            return res.status(500).json({
                message:e
            })
        }
    }

    sendNotifycationEmail = async (id, email,res) =>{
        const uniqueString=uuidv4().slice(0,6)

        const mailOptions={
            from:process.env.EMAIL_ACC,
            to:email,
            subject:"Mã xác thực tài khoản của bạn",
            text:`Mã xác thực của bạn là đây ${uniqueString}`
        }

        try{
            const sendAuthMail = await transporter.sendMail(mailOptions);
            const userId= id;

            if(!sendAuthMail){
                return res.status(500).json({message:"Gửi mail thất bại"})
            }
            else{
                try{
                    const userVerification =await userVertificationModel.create({userId,uniqueString})

                    if(!userVerification){throw new Error("Lỗi rồi")}
                    return res.status(200).json({
                        message:"Tạo tài khoản thành công, mã xác thực đã gửi đến email của bạn"
                        
                    })
                }
                catch(e){return res.status(500).json({message:e})}
            }
        }
        catch(e){
            return res.status(500).json({
                message:e
            })
        }
    }

    

    verifyAccount = async(userId,email,uniqueString,res)=>{
        const userVerification= await userVertificationModel.findOne({userId:userId})
        const user= await userModel.findOne({email:email})

        if(!user){
            return res.status(500).json({
                message:"Không có người dùng này"
            })
        }

        if(!userVerification){
            return res.status(500).json({
                message:"Không có user này"
            })
        }

        return res.status(200).json({
            user,
            userVerification
        })
    }

    testSendMail=async (req,res)=>{
        let { userId,email}= req.body
    
        this.sendNotifycationEmail(userId,email,res)

    }

    testVerifyAccount =async (req,res)=>{
        let {userId,email,uniqueString}= req.body
        this.verifyAccount(userId,email,uniqueString,res)
    }

    

}

export default new userController