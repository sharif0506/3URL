import mongoose from 'mongoose';
import validator from 'validator';

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        validate: {
            validator: (v) => validator.isURL(v),
            message: (props) => `${props.value} is not a valid URL!`,
        },
    },

    shortCode: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);
export default Url;
