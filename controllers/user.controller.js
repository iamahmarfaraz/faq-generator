const user = require("../models/user");
const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser")
require("dotenv").config();


// send OTP
exports.sendOTP = async(req,res) => {
    
    try {
        // fetch email from request body
        const {email} = req.body

        // check if user already exist
        const checkUserPresent = await user.findOne({email});

        // if user already existed then return a response of success:false
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message: "User already registered"
            })
        }
        
        // generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP :- ",otp);

        // check the OTP we got is unique or not
        const result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email,otp};

        // create entry of OTP in DB
        const otpBody = await OTP.create(otpPayload);

        // return response
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
        })

    } catch (error) {
        console.log("Error in catch blog of sendOTP controller in ./controllers/auth.js -> ",error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

};


exports.signUp = async (req,res) => {

    try {
        
        // Data Fetching from request body
        const{fullname,email,password,
            confirmPassword,otp} = req.body;

        // validate data
        if (!fullname|| !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success:false,
                message:"All Fields are Mandatory to fill"
            })
        }
        if(password.length < 6){
            return res.status(403).json({
                success:false,
                message:"Password should be 6 digit or greater"
            })
        }

        // cross match password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password & Confirm Password value doesn't matched"
            })
        }

        // check if user already exist
        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",
            })
        }

        // if everything is fine then find the most recent OTP corresponding to the User
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1); 
        console.log(recentOtp);

        // otp expires wali validation bhi daal skte hain

        // validate OTP
        if(recentOtp.length == 0){
            // OTP not found in DB
            return res.status(400).json({
                success:false,
                message:"OTP not found in DB",
            })
        }
        else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        // Hash password
        let hashedPassword = await bcrypt.hash(password,10);

        // create entry in DB

        const User = await user.create({
            fullname,
            email,
            password:hashedPassword,
        })

        // return success response
        return res.status(200).json({
            success:true,
            message:"User successfully registered",
            User,
        })

    } catch (error) {
        console.log("Error signingup :- ",error);
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }

};


exports.login = async (req,res) => {
    try {
        
        // Get data from request body
        const {email,password} = req.body;

        // Validation of data
        if (!email || !password) {
            return res.status(403).json({
                success:false,
                message:"All Fields are Mandatory to fill"
            })
        }

        // check if user is registered or not
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                success:false,
                message:"User not registered "
            })
        }

        // check if password is correct or not
        if (await bcrypt.compare(password,existingUser.password)) {

            // generate JWT
            const payload = {
                email : existingUser.email,
                id: existingUser._id,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"1d",
            });
            // yha pe phat skta hai to .toObject use krlena
            existingUser.token = token;
            existingUser.password = undefined; 

            // create cookie & return response
            const options ={
                expires:new Date(Date.now() + 1*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                existingUser,
                message:"Logged In Successfully"
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect "
            })
        }

    } catch (error) {
        console.log("error while Logging In",error)
        return res.status(400).json({
            success:false,
            message:"Login Failed",
        })
    }
};



