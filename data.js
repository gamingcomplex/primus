const mongoose = require("mongoose")

const dataschema = mongoose.Schema({
    name: String,
    userID: String,
    leaderboard: String,
    money: Number,
    daily: Number,
    job: String,
    jobHours: Number
})

module.exports = mongoose.model("data", dataschema);