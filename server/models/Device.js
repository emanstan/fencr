import mongoose from "mongoose"
const { Schema } = mongoose;

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mac_address: {
        type: String,
        required: true
    },
    ip_address: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        required: true
    },
    venue: {
        type: String
    },
    location: {
        type: String
    },
    position: {
        type: String
    },
    description: {
        type: String
    },
    last_update: {
        type: Date,
        default: Date.now
    }
});

const Device = mongoose.model('Device', DeviceSchema);

export default Device;