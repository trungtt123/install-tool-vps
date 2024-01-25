const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VpsSchema = new Schema({
    hostname: {
        type: String,
        required: true
    },
    publicUrl: {
        type: String
    },
    ngrokAuth: {
        type: String
    }
}, { timestamps: true }, { collection: 'vps' });
module.exports = mongoose.model('vps', VpsSchema);
