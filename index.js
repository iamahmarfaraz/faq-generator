const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const faqRoutes = require("./routes/faqRoutes");
const authRoutes = require("./routes/authRoute");
const redisClient = require("./utils/redisClient");
const database = require("./config/database");

dotenv.config();


app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true, 
    })
);

database.connect();


// Redis Connection Check
redisClient.on("connect", () => {
  console.log("Redis Connected");
});
redisClient.on("error", (err) => {
  console.error("Redis Connection Error:", err);
});

// Routes
app.use("/api/v1", faqRoutes);
app.use("/api/v1", authRoutes);


const PORT = process.env.PORT || 7330;
// Start the Server
app.listen(PORT,()=>{
    console.log(`App is running at PORT : ${PORT}`)
})