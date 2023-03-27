const express = require("express")
const router = express.Router()
const userController =require("../controller/user.controller")


router.get("/",userController.fetchUser)

router.post("/register", userController.registerUser)

router.put("/update", userController.updateUser)

router.delete("/delete/:ID",userController.deleteUser)

router.post("/login", userController.loginUser)

router.get("/find", userController.findUser)

router.get("/get-profile",userController.getUserProfile)

module.exports = router