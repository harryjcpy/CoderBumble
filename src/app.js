const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require('bcrypt');
const {validateSignUp} = require('./utility/validation');
const validator = require('validator');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const users = await User.findOne({ emailId: userEmail});
        if(!users){
            res.send("User not found");
        } else {
            res.send(users);
        }
    } catch(err){
        res.status(404).send("Something went wrong");
    }
});

app.get("/profile", async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.send("cookies mil gyin");
});

app.delete("/user", async (req, res) => {
    const usersId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(usersId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        };
        if(data?.skills.length > 5){
            throw new Error("Bas Kar Bhai");
        }
        const user = await User.findByIdAndUpdate(userId, data, {
            runValidators: true,
        });

        res.send("User Updated Successfully");
    } catch (error) {
        res.status(400).send("UPDATE FAILED: " + error.message);
    }
});

app.get("/feed", async (req, res) => {

    try{
        const users = await User.find({});
        if(users.length===0){
            res.send("No Users Yet");
        } else {
            res.send(users);
        }
    } catch(err){
        res.status(404).send("Something went wrong");
    }
});

app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        res.cookie("token", "Yeh hai Cookie");

        if(!validator.isEmail(emailId)){
            throw new Error('Please enter a valid email');
        };
        const user = await User.findOne({ emailId: emailId});
        if(!user) {
            throw new Error("User not found");
        } 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid) {
            res.send("Login Successful");
        } else{
            throw new Error("Password Incorrect");
        }
    } catch(error){
        res.status(400).send("Error: "+ error.message);
    }
})

app.post("/signup", async (req, res) => {
    try{
        validateSignUp(req);
        const {firstName, lastName, emailId, password, gender } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            gender,
            password: passwordHash,
        });
        await user.save();
        res.send("User Added Successfully");
    } catch(err){
        res.status(400).send("Error Occurred:" + err.message);
    }
});


connectDB().then(()=>{
    console.log("Balle Balle, Database chal chuka hai!");
    app.listen(7777, () => {
        console.log('Server bhi chalu ho chuka hai');
    });
}) .catch(()=>{
    console.error("Error aagya re baba");
});




