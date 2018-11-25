const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user_id: String,
  channel_id: String,
  response_to: String,
  content: String,
  created_on: Date,
  reactions: [
    {
      reaction_id: String,
      users: [String]
    }
  ]
});

MessageSchema.methods.toJSON = function() {
  return {
    id: this._id,
    user_id: this.user_id,
    channel_id: this.channel_id,
    response_to: this.response_to,
    content: this.content,
    created_on: this.created_on,
    reactions: this.reactions || []
  };
};

mongoose.model("Message", MessageSchema);
