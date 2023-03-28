const user = require("../model/user")
const validator = require("email-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


exports.fetchUser = (req, res) => {
    user.fetchUser({}).then(response => {
        res.status(200).send(response)
    }).catch(err => {
        res.status(500).send("Unable to fetch")
    })
}
exports.registerUser = (req, res) => {
     let { name, emailId, password, age } = req.body;
    // if (!name || !emailId || !password || !age) {
    //     res.status(400).send({ Message: "Required fields are missing" })
    //     return
    // }
    if (!validator.validate(emailId)) {
        res.status(400).send({ Message: "Invalid Email ID" })
        return
    }

    // if (password.length < 8) {
    //     res.status(400).send({ Message: "Password must contain minimum 8 character" })
    //     return
    // }

    user.findUserByEmail({ emailId: emailId }).then(existingData => {
        if (existingData) {
            res.status(400).send({ Message: "Email id already exists" })
            return
        }
    
        bcrypt.genSalt(5).then(salt => {
            bcrypt.hash(password, salt).then(hashPassword => {
                let userData = { name, emailId, password: hashPassword, age }
                user.registerUser(userData).then(response => {
                    res.status(200).send({ message: "Registered successfully", data: response })
                }).catch(err => {
                    res.status(500).send("Unable to register")
                })
            })
        })
    }).catch(err => {
        console.log("error", err)
        res.status(400).send("Unable to register")
    })

}
exports.updateUser = (req, res) => {
    let ID =  req.query.id 
    if(!ID){
        res.status(400).send({message:"ID is required"})
        return
    }
    let data = req.body
    user.findUser(ID).then(response=>{ 
        if(!response) return  res.status(400).send("User not found")
        user.updateUser(ID,data).then(response => {
            res.status(200).send({message:"Succesfully updated",data:response})
        }).catch(err => {
            res.status(500).send("Unable to update")
        }) 
    }).catch(err=>{
        res.status(500).send("Unable to update")
    })
}
exports.deleteUser =  (req, res) => {
    let ID =req.params.ID
    if(!ID) return res.status(400).send({message:"ID is required"})
    
    user.deleteUser(ID).then(response => {
        res.status(200).send({ Message: "Data Deleted successfully", response: response })
    }).catch(err => {
        res.status(500).send("Unable to delete data")
    })
}
exports.loginUser = (req, res) => {
    let { emailId, password } = req.body
    // if (!emailId || !password) {
    //     res.status(400).send({ message: "Required fields are missing" })
    //     return
    // }
    user.findUserByEmail({ emailId: emailId }).then(response => {
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
}
exports.findUser = (req, res) => {
    let ID = req.query.id
    if (!ID) {
        res.status(400).send({ message: "User ID is missing" })
        return
    }
    user.findUser(ID).then(response => {
        res.status(200).send({ message: "Fetched Successfully", data: response })
    }).catch(err => {
        res.status(500).send({ message: "Unable to find" })
    })
}
exports.getUserProfile =(req,res)=>{
    res.status(200).send(req.user)
    return
}