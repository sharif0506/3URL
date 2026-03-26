import {createUser, findUserByEmail} from "../Service/UserService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import User from '../Model/User.js';
import sendEmail from '../Helpers/email.js';

const handleCreateUser = async (req, res) => {
    try {
        const {firstName, lastName, email, country, password} = req.body;

        const user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({message: "Email already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const status = 'active';
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        await createUser({
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

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare the password (plain text) with the hashed password in the DB
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.status !== 'active') {
            return res.status(401).json({ message: "User is not active" });
        }

        const jwtToken = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "User logged in successfully", data: { token: jwtToken } });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Request password reset
export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // expires after 1 hour
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
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        user.password = await bcrypt.hash(password, 10);
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