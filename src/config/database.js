const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://harry15766:k6IEpY8OyEeTS3ME@cluster0.2wjoq.mongodb.net/coderBumble");
};

module.exports = connectDB;

