const users = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

exports.registerController = async(req,res)=>{
    console.log("Inside registerController");
    console.log(req.body);
    const {name,email,password,phone,role} =req.body
    if (!name || !email || !password||!phone||!role) {
            return res.status(400).json({
                message: "All fields are required"
            });
    }
    // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

    //Email validation using validator
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }
    //phone validation
    if (!validator.isMobilePhone(phone, "en-IN")) {
    return res.status(400).json({
        message: "Invalid phone number"
    });
    }
    //check email in db
    const existingUser = await users.findOne({email})
     if (existingUser){
         //if present,send response as please login 
         res.status(409).json('User Already Exists... please login')
     }else{
        //if not present ,addall details to db send respose as newly insertesd document 
        let encryptPassWord = await bcrypt.hash(password,10)
        const newUser = await users.create({
            name,email,password: encryptPassWord,phone,role
        })
        res.status(201).json(newUser)
     }

}

exports.loginController = async(req,res)=>{
      console.log("Inside loginController");
       
    const {email,password} =req.body
     console.log(req.body)
    if(!email|| !password){
         return res.status(400).json({
                message: "All fields are required"
            });
    }
    
     //check email in db
     const existingUser = await users.findOne({email})
     if (!existingUser){
         return res.status(401).json({
            message:"Invalid credentials"
         })
    }
    const isPasswordMatch = await bcrypt.compare(password,existingUser.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
     // token
    const token = jwt.sign(
        {
            id: existingUser._id,
            role: existingUser.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
    
    // store token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })
       res.status(200).json({
        message: "Login successful",
        user: existingUser
    })
}

exports.getUserController = async(req,res)=>{
    console.log("Inside getUserController")
    const {id} = req.params
    const singleUser = await users.findById(id)

    if (!singleUser) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        message: "User fetched successfully",
        user: singleUser
    })
}
exports.logOutController = async(req,res)=>{
    console.log("Inside logOutController")
      res.clearCookie("token",
         {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })
        res.status(200).json({
            message: "Logout successful"
        })

}