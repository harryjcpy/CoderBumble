const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const cn = require("../models/connectionRequest");


const USER_SAFE_DATA = "firstName lastName age gender skills about";
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await cn.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        })
        
    } catch (error) {
        res.status(400).send(`Error Occured: ${error.message}`);
    }
});


/*userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await cn.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId", USER_SAFE_DATA);
        
        const data = connectionRequests.map((row) => row.fromUserId);

        res.json({data});
    } catch (error) {
        res.status(400).send(`Error Occured: ${error.message}`);
    }
})
*/


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Fetch connection requests where the logged-in user is involved
        const connectionRequests = await cn.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA) // Populate user details for the sender
        .populate("toUserId", USER_SAFE_DATA);   // Populate user details for the receiver

        // Check if the populate worked by logging the result
        console.log("Populated Connection Requests:", connectionRequests);

        // Transform the data to get the other user's details
        const data = connectionRequests.map((request) => {
            let otherUserDetails;

            // If the logged-in user is the 'fromUserId', we want the 'toUserId' details
            if (request.fromUserId._id.equals(loggedInUser._id)) {
                otherUserDetails = {
                    _id: request.toUserId._id,
                    firstName: request.toUserId.firstName,
                    lastName: request.toUserId.lastName,
                    photoUrl: request.toUserId.photoUrl,
                    about: request.toUserId.about,
                    gender: request.toUserId.gender,
                    skills: request.toUserId.skills,
                };
            } else {
                // Otherwise, the logged-in user is the 'toUserId', so we want the 'fromUserId' details
                otherUserDetails = {
                    _id: request.fromUserId._id,
                    firstName: request.fromUserId.firstName,
                    lastName: request.fromUserId.lastName,
                    photoUrl: request.toUserId.photoUrl,
                    about: request.toUserId.about,
                    gender: request.toUserId.gender,
                    skills: request.toUserId.skills,
                };
            }

            return otherUserDetails;
        });

        res.json({ data });
    } catch (error) {
        res.status(400).send(`Error Occurred: ${error.message}`);
    }
});


module.exports = userRouter;