const mongoose = require("mongoose");
const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            throw new Error(`Invalid status ${status}`);
        }


        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);

        if (!fromUser || !toUser) {
            throw new Error("User not found");
        }

        console.log(`Connection Request: From ${fromUser.firstName} to ${toUser.firstName}`);

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(existingConnectionRequest){
            throw new Error(`Request already exists`);
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: `Connection request sent successfully From ${fromUser.firstName} to ${toUser.firstName}`,
            data,
        })

    } catch (err) {
        res.status(400).send("Error Occurred:" + err.message);
    }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        console.log("Logged in user:", loggedInUser);

        console.log("Query Parameters:", { _id: requestId, toUserId: loggedInUser._id, status: "interested" });

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error('Invalid status');
        }
        
        const conRequest = await ConnectionRequest.findOne({
            fromUserId: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if(!conRequest){
            throw new Error('Connection request not found');
        }
        
        const fromUser = await User.findById(conRequest.fromUserId);
        const toUser = await User.findById(loggedInUser._id);

        if (fromUser && toUser) {
            console.log(`Connection Request Review: From ${fromUser.firstName} to ${toUser.firstName}`);
        }
        conRequest.status = status;

        const data = await conRequest.save();

        res.json({message: `Connection request of ${fromUser.firstName} ${status} by ${toUser.firstName}`, data});

    } catch (err) {
        res.status(400).send("Error Occurred:" + err.message);
    }
})

module.exports = requestRouter;