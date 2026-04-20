import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import {ENV} from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message: 'Please enter a valid email'});
        }

        if(password.length < 8) {
            return res.status(400).json({message: 'Password must be at least 8 characters'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email: email},undefined,undefined)
        if(user) {
            return res.status(400).json({message: 'Email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        });

        if(newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);
            res.status(201).json( {
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                profilePic: savedUser.profilePic,
                }
            );

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            }
            catch(err) {
                console.error("Failed to send welcome email:", err);
            }
        }
        else {
            return  res.status(400).json({message: 'Invalid user data'});
        }
    }
    catch(error){
        console.error("Error in signup controller",error);
        return res.status(400).json({message: 'Internal Server Error'});
    }
}