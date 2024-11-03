const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require('../utility/validation');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData){
            throw new Error("Invalid Profile");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser});
        console.log(loggedInUser);
    } catch(err){
        res.status.send(`Error Occurred ${err.message}`);
    }
})

module.exports = profileRouter;