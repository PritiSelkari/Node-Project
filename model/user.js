const { response } = require("express");
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    emailId :{
        type : String,
        unique : true,
        requred : true
    },
    password :{
        type : String,
        required : true
    },
    age :{
        type: Number,
        required : false
    }
},{timestamps:true})
const user = mongoose.model("User",userSchema);

user.fetchUser = ()=> {
    return new Promise((resolve,reject)=>{
        user.find({},(err,response)=>{
            if(err){
                reject(err);
            } else{
                resolve(response)
            }
        })
    })
}

user.registerUser =(query)=>{
    return new Promise((resolve,reject)=>{
        user.findOne(query,(err,response)=>{
            if(err){
                reject(err)
            } else{
                resolve(response)
            }
        })
    })
}


module.exports = user;