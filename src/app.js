const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

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

app.delete("/user", async (req, res) => {
    const usersId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(usersId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(404).send("Something went wrong");
    }
});

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "before",
        });
        console.log(user);
        res.send("User Updated Successfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
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

app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try{
        user.save();
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




