const FAQ = require("../models/faq");
const { translateText } = require("../utils/translate");
const redisClient = require("../config/redisClient")

//  Get FAQs with Multi-language Support (with Redis caching)
exports.getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // Default to English
    const cacheKey = `faqs:${lang}`;

    // Check if data exists in Redis cache
    redisClient.get(cacheKey, async (err, cachedData) => {
      if (err) console.error("Redis Get Error:", err);

      if (cachedData) {
        return res.status(200).json({
          success:true,
          message : "FAQ retrieved",
          data : JSON.parse(cachedData)
        }); // Return cached data
      }

      // If not cached, fetch from MongoDB
      const faqs = await FAQ.find();

      for (let faq of faqs) {
        if (!faq.translations[`question_${lang}`]) {
          faq.translations[`question_${lang}`] = await translateText(faq.question, lang);
          faq.translations[`answer_${lang}`] = await translateText(faq.answer, lang);
          await faq.save();
        }
      }

      const formattedFAQs = faqs.map((faq) => ({
        question: faq.translations[`question_${lang}`] || faq.question,
        answer: faq.translations[`answer_${lang}`] || faq.answer,
      }));

      // Storing in Redis cache for 1 hour
      redisClient.setex(cacheKey, 3600, JSON.stringify(formattedFAQs));

      res.status(200).json({
        success:true,
        data : "Data retrieved",
        formattedFAQs
      });
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ success:false, message: "Server Error" });
  }
};

//Adding New FAQ (Clears Cache)
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = new FAQ({ question, answer, translations: {} });
    await newFAQ.save();

    //Clearing Redis cache for all languages
    redisClient.keys("faqs:*", (err, keys) => {
      if (err) console.error("Redis Key Error:", err);
      keys.forEach((key) => redisClient.del(key));
    });

    res.status(201).json(newFAQ);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Server Error" });
  }
};