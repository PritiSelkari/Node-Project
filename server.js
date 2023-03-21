const express = require("express")
const mongoose = require("mongoose")
const Body_Parser = require("body-parser")
const jwt = require("jsonwebtoken")
const validator = require("email-validator")
const bcrypt = require("bcrypt")
const user = require("./model/user")
const { response } = require("express")


const app = express()
mongoose.connect("mongodb+srv://munnas:0000@cluster0.diaip.mongodb.net/xyz?retryWrites=true&w=majority").then(response => {
    console.log("Database connected")
}).catch(err => {
    console.log("Error while connecting the database")
})
app.use((req, res, next) => {
    let path = req.path
    if (["/register", "/login"].indexOf(path) !== -1) {
        return next()
    }
    let token = req.header.token
    if (!token) {
        req.status(400).send({ message: "Token not provided" })
        return
    }
    jwt.verify(token, "secure_Token", (err, decodedToken) => {
        if (err) {
            res.status(400).send({ message: "Invalid token" })
            return
        }
        user.findOne({ emailId: decodedToken.emailId, _id: decodedToken._id }, response => {
            if (!response) {
                res.status(400).send({ message: "User is not found" })
                return
            }
            next();
        }

        )
    })
})
app.use(Body_Parser.urlencoded({ extended: true }))
app.use(Body_Parser.json({}))

app.post("/register", (req, res) => {
    let { name, emailId, password, age } = req.body
    if (!name || !emailId || !password || !age) {
        res.status(400).send({ message: "Required field are missing" })
        return
    }
    if (!validator.validate(emailId)) {
        res.status(400).send({ message: "Enter correct email address here" })
        return
    }
    if (password.length < 8) {
        res.status(400).send({ message: "password must be minimum 8 charecter" })
        return
    }
    user.findOne({ emailId: emailId }).then(existingData => {
        if (existingData) {
            res.status(400).send({ message: "User already exists" })
            return
        }
        bcrypt.genSalt(5).then(salt=>{
            bcrypt.hash(password,salt).then(hashPassword=>{
                let userData ={name,emailId,password:hashPassword,age}
                user.create(userData).then(response=>{
                    res.status(200).send({message:"User is successfully registered"})
                }).catch(err=>{
                    res.status(500).send({message:"User unable to registered"})
                })
            })
        })

    }).catch(err=>{
        res.status(400).send("Unable to register")
    })

})
app.post("/login", (req,res)=>{
    let {emailId,password} = req.body
    if(!emailId||!password){
        res.status(400).send({message:"Required fields are missing"})
        return
    }
    user.findOne({emailId:emailId}).then(response=>{
        if(!response){
            res.status(400).send({message:"Not registered"})
            return
        }
        bcrypt.compare(password,response.password,(err,isMatch)=>{
            if(err){
                res.status(400).send({message:"Please enter correct password"})
                return
            }if(!isMatch){
                res.status(400).send({message:"Please enter correct password"})
                return
            } 
            jwt.sign({_id:response.id,emailId:response.emailId},"secureToken",(err,token)=>{
                if(err){
                    res.status(400).send({message:"Unable to login"})
                    return
                }
                res.status(400).send({message:"logged in successfully",token})
                return
            })
        })
        

    })
})
app.listen(3000, (err, res) => {
    if (err) {
        console.log("Unable to conncet the server");
    } else {
        console.log("Server connected");
    }

})