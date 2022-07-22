import mongoose from "mongoose"
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    settings: {
        type: Object,
        required: true
    },
    friends: {
        type: Object,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

export default User;