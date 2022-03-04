require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())


app.use('/user', require('./routes/userRouter'))
app.use('/api',require('./routes/uploadRouter'))







const URL = process.env.MY_DB

mongoose.connect(URL,{useNewUrlParser:true},()=>{
    console.log("Db connected");
})


const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log("Listen server");
})