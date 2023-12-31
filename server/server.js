const express = require('express')
require('dotenv').config()
const dbConnect= require('./config/dbconnect')
const initRouter = require('./routes')
const cookieParser = require('cookie-parser')

const app =express()
app.use(cookieParser())
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({extended : true}))

dbConnect()
initRouter(app)

app.listen(port,()=>{
    console.log('Server running on the port: '+port);
})