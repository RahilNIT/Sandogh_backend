const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
    createdAt: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    members: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
    }],
    dayOfMonth: {
        type: Number,
        required: true
    },
    shareValue: {
        type: Number,
        required: true
    },
    winners: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        Date: {
            type: Date,
            required: true
        }
    }],
});

module.exports = mongoose.model('Loan', loanSchema);