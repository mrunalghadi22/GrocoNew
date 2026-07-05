const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
{
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    
    user_name: {
        type: String,
        trim: true
    },
    
    phn_num: {
        type: String,
        trim: true
    },
    
    street_address: {
        type: String,
        required: true,
        trim: true
    },
    
    locality: {
        type: String,
        trim: true
    },
    
    city: {
        type: String,
        required: true,
        trim: true
    },
    
    state: {
        type: String,
        required: true,
        trim: true
    },
    
    pin_code: {
        type: String,
        required: true,
        trim: true
    },
    
    address_type: {
        type: String,
        enum: ['Home', 'Work'],
        default: 'Home'
    },
    
    is_default: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model("Address", addressSchema);