const mongoose = require("mongoose");

var AllWordsSchema = new mongoose.Schema({
    category: String,
    words: Array
});

module.exports = mongoose.model("AllWords", AllWordsSchema);


