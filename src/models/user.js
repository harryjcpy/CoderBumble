const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id }, "CoderonKaBumble@123", {expiresIn: "1h"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordEnteredByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordEnteredByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);