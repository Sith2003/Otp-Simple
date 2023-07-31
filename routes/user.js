const express = require('express')
const router = express.Router()

//Handlers from controllers
const {login, signup, sendOTP} = require("../controllers/auth")
const {users, user, updateUser, deleteUser} = require("../controllers/user")
// const {auth, isStudent, isAdmin} = require('../middlewares/authMiddle')

router.post('/login', login)
router.post('/signup', signup)
router.post('/send-otp', sendOTP)

router.get('/users', users)
router.get('/user', user)
router.patch('/update', updateUser)
router.delete('/delete', deleteUser)


// //testing protected route
// router.get("/test",auth, (req,res)=>{
//     res.json({
//         success: true,
//         message: "You are a valid Tester 👨‍💻"
//     })
// })
// //protected routes
// router.get('/student', auth, isStudent, (req,res)=>{
//     res.json({
//         success: true,
//         message: "You are a valid Student 🧑‍🎓"
//     })
// })

// router.get('/admin', auth, isAdmin, (req,res)=>{
//     res.json({
//         success: true,
//         message: "You are a valid Admin 😎"
//     })
// })

module.exports = router