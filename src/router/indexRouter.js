import express from 'express'
import userController from '../controller/userController.js'

const indexRouter = express.Router()

indexRouter.post("/signUp",userController.signUp,userController.sendNotifycationEmail)
indexRouter.post("/sendEmail",userController.testSendMail)
indexRouter.post("/verifyAccount",userController.testVerifyAccount)


export default indexRouter