import {createUser, findUserByEmail, findUserByEmailAndPassword} from "../Service/UserService.js";
import validator from "validator";
import bcrypt from "bcrypt";

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

        // Check if user already exists
        const user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({message: "Email already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const status = 'pending';

        const newUser = await createUser({firstName, lastName, email, country, password: hashedPassword, status});

        return res.status(201).json({message: "User created successfully"});

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

        // User is authenticated, return success
        return res.status(200).json({ message: "User logged in successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export {handleCreateUser, handleLogin};