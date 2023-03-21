const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
const user = require("./model/user")
const bcrypt = require("bcrypt")
const validator = require("email-validator")
const jwt = require("jsonwebtoken")

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
                next();
            
            })
        })
    
})

app.get("/", (req, res) => {
    user.find({}).then(response => {
        res.status(200).send(response)
    }).catch(err => {
        res.status(500).send("Unable to fetch")
    })
})

app.post("/register", (req, res) => {
    let { name, emailId, password, age } = req.body;
    if (!name || !emailId || !password || !age) {
        res.status(400).send({ Message: "Required fields are missing" })
        return
    }
    if (!validator.validate(emailId)) {
        res.status(400).send({ Message: "Invalid Email ID" })
        return
    }

    if (password.length < 8) {
        res.status(400).send({ Message: "Password must contain minimum 8 character" })
        return
    }

    user.findOne({ emailId: emailId }).then(existingData => {
        if (existingData) {
            res.status(400).send({ Message: "Email id already exists" })
            return
        }

        bcrypt.genSalt(5).then(salt => {
            bcrypt.hash(password, salt).then(hashPassword => {
                let userData = { name, emailId, password: hashPassword, age }
                user.create(userData).then(response => {
                    res.status(200).send({ message: "Registered successfully", data: response })
                }).catch(err => {
                    res.status(500).send("Unable to register")
                })
            })
        })
    }).catch(err => {
        res.status(400).send("Unable to register")
    })

})


app.put("/update", (req, res) => {
    let query = { emailId: req.query.emailid }
    let data = req.body
    user.findOneAndUpdate(query, data, { new: true }).then(response => {
        res.status(200).send(response)
    }).catch(err => {
        res.status(500).send("Unable to update")
    })
})

app.delete("/delete/:email", (req, res) => {

    user.findOneAndDelete({ emailId: req.params.email }).then(response => {
        res.status(200).send({ Message: "Data Deleted successfully", response: response })
    }).catch(err => {
        res.status(500).send("Unable to delete data")
    })
})


app.post("/login", (req, res) => {
    let { emailId, password } = req.body
    if (!emailId || !password) {
        res.status(400).send({ message: "Required fields are missing" })
        return
    }
    user.findOne({ emailId: emailId }).then(response => {
        if (!response) {
            res.status(400).send({ message: "User not registered" })
            return
        }
        bcrypt.compare(password, response.password, (err, isMatch) => {
            if (!isMatch) {
                res.status(400).send({ message: "Invalid credential" })
                return
            }
            jwt.sign({ _id: response._id, emailId: response.emailId }, "secure-Token", { expiresIn: "2 days" }, (err, token) => {
                res.status(200).send({ message: "Successfully logged in", token: token })
                return
            })
        })
    }).catch(err => {
        res.status(500).send({ message: "Unable to find data" })
        return
    })
})

app.get("/find", (req, res) => {
    let ID = req.query.id
    if (!ID) {
        res.status(400).send({ message: "User ID is missing" })
        return
    }
    user.findById(ID).then(response => {
        res.status(200).send({ message: "Fetched Successfully", data: response })
    }).catch(err => {
        res.status(500).send({ message: "Unable to find" })
    })
})

app.listen(3000, (err, response) => {
    if (err) {
        console.log("Error while connecting to the server")
    } else {
        console.log("server connected")
    }
})