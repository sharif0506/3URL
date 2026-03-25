import validator from "validator";

export const validateCreateUser = (req, res, next) => {
    const { firstName, lastName, email, country, password, retypePassword } = req.body;

    if (!firstName || !lastName) {
        return res.status(400).json({ message: "Firstname and lastname are required." });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }

    if (country && country.length !== 2) {
        return res.status(400).json({ message: "Country code must be 2 characters long." });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    if (password !== retypePassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    next();
};

export const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    next();
};

export const validateResetPassword = (req, res, next) => {
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    next();
};
