import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js"
import generateTokenAndSetCookie from "../utils/generateToken.js";

dotenv.config();

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne( { username } );
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        })
    } catch (error)  {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const signup = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error: "Passords don't match"})
        }

        const user = await User.findOne( {username} );

        if(user) {
            return res.status(400).json({error: 'Username already exists.'});
        }

        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            // Generate JWT token here
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({error: "Invalid user data"});
        }
    } catch(error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully!"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const patientRegister = async (req, res) => {
    const {
        firstName,
        lastName,
        gender,
        email,
        mobile,
        dob,
        address,
        medicalHistory
    } = req.body;

    try {
        // generate username from email (first part before)
        const username = email.split('@')[0];

        // generate a random password
        const password = Math.random().toString(36).slice(-8);
        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            gender,
            email,
            mobile,
            dob,
            address,
            access: "Patient"
        });
        const savedUser = await newUser.save();

        const newPatient = new Patient({
            user: savedUser._id,
            medicalHistory
        });
        const savedPatient = await newPatient.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to smile clinic',
            text: `Dear ${firstName},\n\nWelcome to our system!\n\nYour username is: ${username}\nYour password is: ${password}\n\nPlease keep your credentials secure.\n\nBest regards,\nThe Team`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email: ", err);
            } else {
                console.log("Email sent: ", info.response);
            }
        });

        res.status(201).json({ user: savedUser, patient: savedPatient });
    } catch (error) {
        console.error("Error in registering patient: ", error);
        res.status(500).json({ error: "Register patient controller error" });
    }
}