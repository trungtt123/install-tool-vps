const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MobileDeviceSchema = new Schema({
    GPMProfileId: {
        type: String,
        required: true
    },
    mobileDeviceName: {
        type: String
    },
    userAgent: {
        type: String
    },
    mobileMode: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }, { collection: 'mobileDevice' });
module.exports = mongoose.model('mobileDevice', MobileDeviceSchema);
