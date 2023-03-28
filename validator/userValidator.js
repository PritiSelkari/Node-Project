const joi = require("joi")

module.exports = {
    registerUser: (req,res,next)=>{
        const schema = joi.object().keys({
            name: joi.string().required().error(new Error("Name is required")),
            age :joi.number().optional(),
            emailId : joi.string().required().error(new Error("Email ID is required")),
            password : joi.string().required().min(8).max(16).error(new Error("Password is required and contain minimum 8 characters"))

        })
        const {error, value}= schema.validate(req.body)
        if(error){
            res.status(400).send({Message:error.message?error.message:error})
            return
        }else{
            next()
        }
    },
    loginUser: (req,res,next) =>{
        const loginData = joi.object().keys({
            emailId:joi.string().required().error(new Error("Email id is required")),
            password: joi.string().required().min(8).max(16).error(new Error("Password is required"))
        })
        const {error,value} = loginData.validate(req.body)
        if(error){
            res.status(400).send({message:error.message ? error.message : error})
            return
        }else {
            next()
        }
    }
}




