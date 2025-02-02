
const jwt= require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req,res,next) => {
    try {
        
        // extract token
        const token = req.cookies.token 
        || req.body.token 
        || req.header("Authorization").replace("Bearer ","");

        // if token missing return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not Found"
            });
        }

        // verify the token
        try {

            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;


        } catch (error) {
            return res.status(401).json({
            success:false,
            message:"Token Invalid"
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Authentication Failed"
        })
    }
}