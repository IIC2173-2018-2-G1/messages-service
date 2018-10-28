
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

var app        = express();

//cambiar el string de abajo para conectarse a base de datos de mongo
mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

var Message= require('./app/models/message');

router.post('/message', function(req, res) {
    var message = new Message();

    message.channel_id = req.body.channel_id;
    message.response = req.body.response;
    message.content = req.body.content;

    // save the bear and check for errors
    message.save(function(err) {
        if (err)
            res.json({ message: 'Error creating message',
                       Error: err});

        res.json({ message: 'Message created',
                   Error: ""});
    });


});


router.get('/messages', function(req, res) {

    Message.find({channel_id:req.query.channel_id,
                  hashtag: req.query.hashtag,
                  count:req.query.count,
                  start: req.query.count},
        function (err, messages) {
            if(err) res.json({messages, Error:err});

            res.json({messages, Error:""});
    });

});


app.use('/', router);

app.listen(port);
console.log('Message service listening on port' + port);