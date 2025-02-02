const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true, 
  },
  answer: {
    type: String,
    trim: true, 
  },
  translations: {
    question_hi: {
        type: String,
        trim: true, 
      },
    answer_hi: {
        type: String,
        trim: true, 
      },
    question_bn: {
        type: String,
        trim: true, 
      },
    answer_bn: {
        type: String,
        trim: true, 
      },
  },
});

module.exports = mongoose.model("FAQ", FAQSchema);