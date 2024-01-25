const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailSchema = new Schema({
    GPMProfileId: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    recoverEmail: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
    birthDay: {
        type: String
    },
    gender: {
        type: String
    },
    homeAddress: {
        type: String
    },
    workAddress: {
        type: String
    }
}, { timestamps: true }, { collection: 'mails' });
module.exports = mongoose.model('mails', MailSchema);
