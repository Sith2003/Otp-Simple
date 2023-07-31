const bcrypt = require('bcrypt')
const User = require("../models/user")
// const jwt= require('jsonwebtoken')
const OTP = require('../models/otp')
const otpGenerator = require("otp-generator");
// require('dotenv').config()

//signup handle
exports.signup = async(req, res)=> {
    try {
        //get input data
        const {name, email, password, role, otp}= req.body

        // Check if All Details are there or not
		if (!name || !email || !password || !otp ) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}

        //check if use already exists?
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		// console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

        //secure password
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password,10)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message : `Hashing pasword error for ${password}: `+ error.message
            })
        }

        const newUser = await User.create({
            name, email, password:hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            newUser,
            message: "user created successfully ✅"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "User registration failed"
        })
    }
}


exports.login = async(req, res)=> {

    try {
        //data fetch
        const {email, password} = req.body
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Plz fill all the details carefully"
            })
        }

        //check for registered User
        let user= await  User.findOne({email})
        //if user not registered or not found in database
        if(!user){
            return res.status(401).json({
                success: false,
                message: "You have to Signup First"
            })
        }

        // const payload ={
        //     email: User.email,
        //     id: User._id,
        //     role: User.role,
        // }
        // //verify password and generate a JWt token 🔎
        // if(await bcrypt.compare(password,User.password)){
        //     //if password matched
        //      //now lets create a JWT token
        //      let token = jwt.sign(payload, 
        //                 process.env.JWT_SECRET,
        //                 {expiresIn: "2h"}
        //                 )
        //     User = User.toObject()
        //     User.token = token
            
        //     User.password = undefined
        //     const options = {
        //         expires: new Date( Date.now()+ 3*24*60*60*1000),
        //         httpOnly: true  //It will make cookie not accessible on clinet side -> good way to keep hackers away

        //     }
        //     res.cookie(
        //         "token",
        //         token,
        //         options
        //     ).status(200).json({
        //         success: true,
        //         token,
        //         User,
        //         message: "Logged in Successfully✅"

        //     })

        // }else{
        //     //password donot matched
        //     return res.status(403).json({
        //         success: false,
        //         message: "Password incorrects⚠️"
        //     })
        // }
 
        return res.status(201).json({
            success: true,
            message: 'login successfully',
            user: user
          });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Login failure⚠️ :" + error
        })
    }

}

// Send OTP For Email Verification
exports.sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      // Check if user is already present
      const checkUserPresent = await User.findOne({ email });
      // If user found with provided email
      if (checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: 'User is already registered',
        });
      }
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let result = await OTP.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await OTP.findOne({ otp: otp });
      }
      const otpPayload = { email, otp };
      const otpBody = await OTP.create(otpPayload);
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
      });
      return otpBody
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const deleteUser = await User.findById(req.body.id);

    return res.status(200).json(deleteUser);
};