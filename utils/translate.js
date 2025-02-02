const axios = require("axios");
require("dotenv").config();

async function translateText(text, targetLang) {
  if (!text) return "";

  const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`;
  
  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLang,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Return original text if translation fails
  }
}

module.exports = { translateText };