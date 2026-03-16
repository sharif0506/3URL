import {createUser, findUserByEmail, findUserByEmailAndPassword} from "../Service/UserService.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import User from '../Model/User.js';
import sendEmail from '../Helpers/email.js';

const handleCreateUser = async (req, res) => {

    try {
        const {firstName, lastName, email, country, password, retypePassword} = req.body;

        // Validation
        if (!firstName || !lastName) {
            return res.status(400).json({message: "Firstname and lastname are required."});
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({message: "Invalid email address."});
        }

        if (country.length !== 2) {
            return res.status(400).json({message: "Country code must be 2 characters long."});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long."});
        }

        if (password !== retypePassword) {
            return res.status(400).json({message: "Passwords do not match."});
        }

        // Check if a user already exists
        const user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({message: "Email already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const status = 'active';
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await createUser({
            firstName, lastName, email, country, password: hashedPassword, status,
            emailVerificationToken,
            isEmailVerified: false
        });

        // Send verification email
        const verificationLink = `${req.protocol}://${req.get('host')}/api/users/verify-email/${emailVerificationToken}`;
        await sendEmail(email, 'Verify your email', `Click to verify: ${verificationLink}`);

        return res.status(201).json({message: "User created successfully. Please check your email to verify your account."});

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message: "Internal Server Error"});
    }
}

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the inputs
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await findUserByEmail(email);

        // If the user is not found
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare the password (plain text) with the hashed password in the DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check if the user's status is 'pending'
        if (user.status === 'pending') {
            return res.status(401).json({ message: "User is not active" });
        }

        const jwtToken = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // User is authenticated, return success
        return res.status(200).json({ message: "User logged in successfully", data: { token: jwtToken } });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        const resetLink = `${req.protocol}://${req.get('host')}/api/users/reset-password/${token}`;
        await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetLink}`);
        res.json({ message: 'Password reset link sent' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Email verification controller
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ emailVerificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();
        res.json({ message: 'Email verified successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export {handleCreateUser, handleLogin};