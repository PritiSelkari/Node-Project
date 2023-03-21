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
module.exports = user;