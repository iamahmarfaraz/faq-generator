const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/singupTemplate");

const otpSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp : {
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },

});

// Ensure the createdAt field is set correctly
// otpSchema.pre('save', function(next) {
//     if (!this.createdAt) {
//         this.createdAt = Date.now();
//     }
//     next();
// });

// a function to send mail
async function sendVerificationEmail(email,otp){
    try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

otpSchema.pre("save",async function(next){
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})


module.exports = mongoose.model("OTP",otpSchema);