import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import DBconnect from './src/config/dbConnect.js'
import indexRouter from './src/router/indexRouter.js'

const app = express()
const PORT=process.env.PORT

app.use(express.json())
app.use(cors())

//Kết nối db
DBconnect()

//
app.use('/api',indexRouter)


app.listen(PORT,()=>{
    console.log(`Websever trên Port ${PORT}`);
})

