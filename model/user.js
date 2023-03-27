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
        user.find({}).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
}
user.findUserByEmail =(query)=>{
    return new Promise((resolve,reject)=>{
        user.findOne(query).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
}
user.registerUser =(userData)=>{
    return new Promise((resolve,reject)=>{
        user.create(userData).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
}
user.updateUser=(query,data)=>{
    return new Promise((resolve,reject)=>{
        user.findByIdAndUpdate(query, data,{ new: true }).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
}
user.deleteUser= (query)=>{
    return new Promise((resolve,reject)=>{
        user.findByIdAndDelete(query).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
}
user.findUser =(ID)=>{
    return new Promise((resolve,reject)=>{
        user.findById(ID).then(response=>{
            resolve(response)
        }).catch(err=>{
            reject(err)
        })
    })
}




module.exports = user;