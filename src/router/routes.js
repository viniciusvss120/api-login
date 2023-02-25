const express = require('express')
const router = express.Router()
const UserController = require('../controller/UserController')
const AdminAuth = require('../middleware/AdminAuth')


router.get("/", (req,res) => {
    res.send("iniciando o projeto")
})

router.get("/user",AdminAuth.decoded,UserController.viewsUsers)
router.post("/user", UserController.createUser)
router.put("/edituser",UserController.editUser)
router.delete("/user/:id", UserController.deleteUser)

router.post("/login", UserController.login)
router.post("/recoverpassword", UserController.recoverPassword)
router.post("/changepassword",UserController.chengePassword)

module.exports = router