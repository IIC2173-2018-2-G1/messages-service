var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    channel_id: String,
    response_to: {type:Number, default: 0},
    content: String,
});

mongoose.model('Message', MessageSchema);