const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
const user = require("./model/user")
const bcrypt = require("bcrypt")
const validator = require("email-validator")
const jwt = require("jsonwebtoken")
const userRouter = require("./routes/user")

const app = express()

mongoose.connect("mongodb+srv://munnas:0000@cluster0.diaip.mongodb.net/xyz?retryWrites=true&w=majority").then(response => {
    console.log("database connected")
}).catch(err => {
    console.log("Error while connecting to the database")
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    let path =req.path
    if(["/register","/login"].indexOf(path)!== -1){
        return next();
    }
        let token = req.headers.token
        if (!token) {
            res.status(400).send({ message: "No token provided" })
            return
        }
        jwt.verify(token, "secure-Token", (err, decodedToken) => {
            if (err) {
                res.status(400).send({ message: "Invalid Token" })
                return
            }
            console.log(decodedToken)
            user.findOne({ _id: decodedToken._id, emailId: decodedToken.emailId }).then(response => {
                if (!response) {
                    res.status(400).send({ message: "User not find" })
                    return
                }
                req.user = response  
                next();
            
            })
        })
    
})
// routing 
app.use("/",userRouter)

app.listen(3000, (err, response) => {
    if (err) {
        console.log("Error while connecting to the server")
    } else {
        console.log("server connected")
    }
})