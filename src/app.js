const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");


app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Harshit",
        lastName: "Mishra",
        emailId: "Harshit@mishra.com",
        password: "123",
    });

    try{
        user.save();
        res.send("User Added Successfully");
    } catch(err){
        res.status(400).send("Error Occurred:" + err.message);
    }
})


connectDB().then(()=>{
    console.log("Balle Balle, Database chal chuka hai!");
    app.listen(7777, () => {
        console.log('Server bhi chalu ho chuka hai');
    });
}) .catch(()=>{
    console.error("Error aagya re baba");
});




