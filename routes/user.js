const express = require("express")
const router = express.Router()
const userController =require("../controller/user.controller")
const userValidator = require("../validator/userValidator")

router.get("/",userController.fetchUser)

router.post("/register", userValidator["registerUser"],userController.registerUser)

router.put("/update", userController.updateUser)

router.delete("/delete/:ID",userController.deleteUser)

router.post("/login", userValidator["loginUser"],userController.loginUser)

router.get("/find", userController.findUser)

router.get("/get-profile",userController.getUserProfile)

module.exports = router