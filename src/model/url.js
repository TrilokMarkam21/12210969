const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: Date,
    referrer: String,
    location: String,
});

const urlSchema = new mongoose.Schema({
    originalUrl:String,
    Shortcode: {type: String, unique: true},
    createdAt: {type: Date, default: Date.now},
    expirityData: Date,
    clicks: [clickSchema]
});

module.exports = mongoose.model('Url', urlSchema);
