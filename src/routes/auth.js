const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { validateSignUp } = require('../utility/validation');
const User = require("../models/user");
const validator = require('validator');

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error('Please enter a valid email');
        };
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Successful");
        } else {
            throw new Error("Password Incorrect");
        }
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUp(req);
        const { firstName, lastName, emailId, password, gender } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(password);
        const user = new User({
            firstName,
            lastName,
            emailId,
            gender,
            password: passwordHash,
        });
        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("Error Occurred:" + err.message);
    }
});

module.exports = authRouter;