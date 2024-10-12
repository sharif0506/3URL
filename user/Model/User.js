import mongoose from 'mongoose';
import validator from 'validator';


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 2, // Enforce a minimum length of 2 characters
        maxlength: 2, // Enforce a maximum length of 2 characters
        validate: {
            validator: function(v) {
                return /^[A-Z]{2}$/.test(v); // Ensure it contains exactly two uppercase alphabetic characters
            },
            message: 'Country code must be a 2-letter uppercase alphabetic code.'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
