var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    channel_id: Number,
    response_to: {type:Number, default: 0},
    content: String,
});

module.exports = mongoose.model('Message', MessageSchema);