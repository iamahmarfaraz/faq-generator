
# FAQ Generator API

This is a full-stack web application designed to manage Frequently Asked Questions (FAQs). The API allows admin users to create FAQs, manage user sign-up and login with OTP-based email verification, and offers multilingual support for questions and answers.

## Features

- **User Authentication**: Sign up and login functionality using JWT (JSON Web Tokens).
- **OTP Verification**: Email-based OTP verification for user registration.
- **FAQ Management**: Admin can create and view FAQs. Translations for FAQs are supported in multiple languages (Hindi, Bengali).
- **Redis Integration**: Cache frequently accessed data using Redis.
- **Google Translation API**: Translates questions and answers into multiple languages.
- **Email Notifications**: Sends OTPs via email for verification.

---

## Table of Contents

1. [Installation](#installation)
2. [API Routes](#api-routes)
    - [Authentication Routes](#authentication-routes)
    - [FAQ Routes](#faq-routes)
3. [Environment Variables](#environment-variables)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Redis Setup](#redis-setup)
7. [License](#license)

---

## Installation

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (>= 14.x)
- MongoDB (Local or Atlas)
- Redis (For caching)
- Google Cloud API Key for Translation

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/iamahmarfaraz/faq-generator-api.git
   cd faq-generator-api
   ```

2. **Install dependencies**

   Install the required dependencies using npm:

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   JWT_SECRET=your-jwt-secret
   MAIL_HOST=smtp.mailtrap.io
   MAIL_USER=your-email-user
   MAIL_PASS=your-email-password
   GOOGLE_API_KEY=your-google-api-key
   REDIS_HOST=localhost
   REDIS_PORT=6379
   MONGO_URI=your-mongodb-connection-uri
   ```

4. **Start the server**

   Run the server using:

   ```bash
   npm start
   ```

   The app should now be running at `http://localhost:7330`.

---

## API Routes

### Authentication Routes

#### `POST /api/v1/login`

- **Description**: Logs in a user using their credentials.
- **Body**:

   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

- **Response**:

   ```json
   {
     "success": true,
     "token": "jwt-token"
   }
   ```

#### `POST /api/v1/signup`

- **Description**: Registers a new user and sends an OTP to the provided email.
- **Body**:

   ```json
   {
     "fullname": "John Doe",
     "email": "user@example.com",
     "password": "password123"
   }
   ```

- **Response**:

   ```json
   {
     "success": true,
     "message": "OTP sent to email."
   }
   ```

#### `POST /api/v1/sendotp`

- **Description**: Sends an OTP to the user's email for verification.
- **Body**:

   ```json
   {
     "email": "user@example.com"
   }
   ```

- **Response**:

   ```json
   {
     "success": true,
     "otp": "123456"
   }
   ```

---

### FAQ Routes

#### `GET /api/v1/faqs`

- **Description**: Fetches all FAQs.
- **Response**:

   ```json
   [
     {
       "question": "What is FAQ?",
       "answer": "Frequently Asked Questions",
       "translations": {
         "question_hi": "FAQ क्या है?",
         "answer_hi": "Frequently Asked Questions",
         "question_bn": "FAQ কী?",
         "answer_bn": "Frequently Asked Questions"
       }
     }
   ]
   ```

#### `POST /api/v1/faqs`

- **Description**: Allows the admin to create a new FAQ.
- **Authorization**: Requires admin authentication (JWT token).
- **Body**:

   ```json
   {
     "question": "What is FAQ?",
     "answer": "Frequently Asked Questions",
     "translations": {
       "question_hi": "FAQ क्या है?",
       "answer_hi": "Frequently Asked Questions",
       "question_bn": "FAQ কী?",
       "answer_bn": "Frequently Asked Questions"
     }
   }
   ```

- **Response**:

   ```json
   {
     "success": true,
     "message": "FAQ created successfully."
   }
   ```

---

## Environment Variables

Here are the environment variables used in the project:

| Variable             | Description                                  |
| -------------------- | -------------------------------------------- |
| `JWT_SECRET`         | Secret key for JWT token generation.         |
| `MAIL_HOST`          | SMTP mail host for sending OTP emails.       |
| `MAIL_USER`          | SMTP user for mail authentication.           |
| `MAIL_PASS`          | SMTP password for mail authentication.       |
| `GOOGLE_API_KEY`     | Google Translate API key for translations.   |
| `REDIS_HOST`         | Redis server host (default: localhost).      |
| `REDIS_PORT`         | Redis server port (default: 6379).           |
| `MONGO_URI`          | MongoDB connection URI.                     |

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer (for OTP email notifications)
- **Translation API**: Google Cloud Translation API
- **Caching**: Redis
- **Environment Variables**: dotenv
- **Validation**: Custom validation for user inputs and OTPs

---

## Project Structure

```
├── config/
│   └── database.js           # Database connection setup
│   └── redisClient.js        # Redis connection setup
├── controllers/
│   └── auth.js               # Authentication controllers
│   └── faq.controller.js      # FAQ controllers
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   └── faq.js                # FAQ model
│   └── otp.js                # OTP model
│   └── user.js               # User model
├── routes/
│   └── authRoute.js          # Auth routes
│   └── faqRoutes.js          # FAQ routes
├── utils/
│   └── mailSender.js         # Mail sending utility
│   └── translate.js          # Google Translate API wrapper
├── .env                      # Environment variables
├── index.js                  # Main entry point for the app
└── README.md                 # Project documentation
```

---

## Redis Setup

1. Install Redis:

   - On **MacOS**: `brew install redis`
   - On **Ubuntu**: `sudo apt install redis-server`

2. Start Redis server:

   ```bash
   redis-server
   ```

3. Configure Redis to be used for caching in your app.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
