require('dotenv').config()
const express = require("express")
const cors = require('cors')
const cookieParser = require("cookie-parser")

const routes = require('./routes/allRoutes')

require('./config/db')
//create server using express package
const server = express()
//enable cors in server
server.use(cors({
    origin: ["http://localhost:5173",
        "https://restaurant-pos-system-frontend.vercel.app/"],
    credentials: true
}))
//parse json to js content
server.use(express.json())
server.use(cookieParser())
// use routes in server
server.use('/api', routes)
//start server to listen client request to that port/available server in internet
const PORT = process.env.PORT
server.listen(PORT,()=>{
    console.log('Server started & waiting for the client request');
})

//resolve API (get request to http://localhost:3000/  using Express)
server.get('/',(req,res)=>{
    res.status(200).send(`<h1>Server started & waiting for the client request</h1>`)
})
//error handling global
server.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})
