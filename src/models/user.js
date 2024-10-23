const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email " + value);
            };
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            };
        }
    },
    age: {
        type: Number,
        min: 18,
        validate(value){
            if(value<18){
                throw new Error("Sorry, come back after 18th birthday");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL " + value);
            };
        }
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
        default: function() {
            return `Hi, I am ${this.firstName}! Nice to meet you.`;  
        }
    },
    skills: {
        type: [String],
    }    
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);