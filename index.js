import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import milkRouters from './routes/milkRoutes.js'

dotenv.config()
const app = express()

app.use(bodyParser.json({limit:"30mb",extended: true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended: true}))
app.use(cors())
const PORT = process.env.PORT || 5000

app.use('/',milkRouters)

mongoose.connect(process.env.DB_CON,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>app.listen(PORT,()=>console.log(`server is running on ${PORT}`)))
    .catch((er)=>console.log(er))
