const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", () => console.log("Redis Connected"));
redisClient.on("error", (err) => console.error("Redis Error:", err));

module.exports = redisClient;