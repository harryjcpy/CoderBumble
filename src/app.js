const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.findOne({ emailId: userEmail });
        if (!users) {
            res.send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(404).send("Something went wrong");
    }
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
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        };
        if (data?.skills.length > 5) {
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

/*app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.send("No Users Yet");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(404).send("Something went wrong");
    }
});*/

connectDB().then(() => {
    console.log("database connection established");
    app.listen(7777, () => {
        console.log('connected to server');
    });
}).catch((err) => {
    console.error(`Error in DB: ${err.message}`);
});




