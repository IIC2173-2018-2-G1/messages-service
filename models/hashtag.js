const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HashtagSchema = new Schema({
  name: String,
  messages: [String]
});

mongoose.model("Hashtag", HashtagSchema);
