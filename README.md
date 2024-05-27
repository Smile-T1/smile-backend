# smile-backend

## Overview
This application serves as the server-side for a dentistry clinic management system. It handles everything from user registration, appointment scheduling, doctor management, to prescription handling. Built with Node.js and MongoDB, it provides robust APIs for interacting with the frontend application.

## Features
- User authentication and registration (for both patients and doctors)
- Appointment scheduling and management
- Doctor specialization management
- Prescription management
- User profile management

## Technology Stack
- **Node.js**: Server runtime environment
- **MongoDB**: NoSQL database
- **Express**: Web application framework
- **Mongoose**: MongoDB object modeling for Node.js
- **Bcrypt.js**: Library for hashing and salting user passwords
- **jsonwebtoken**: Implementation of JSON Web Tokens for authentication

## Setup and Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourgithub/dentistry-clinic-backend.git
   cd dentistry-clinic-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and update the following settings according to your environment:
   ```
   DB_URI=mongodb://localhost:27017/dentistrydb
   PORT=3000
   SECRET_KEY=your_secret_key
   ```

4. **Run the server**
   ```bash
   npm start
   ```

## Contributers
- Sharif Elmasry
- Nada Mohamed
- Youssef Wael
- Hassan Elsheikh
