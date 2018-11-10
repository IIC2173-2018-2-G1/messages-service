
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

var app        = express();

//cambiar el string de abajo para conectarse a base de datos de mongo
mongoose.connect('mongodb://mongodb:27017',{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8083;

var router = express.Router();

var Message= require('./app/models/message');

router.post('/messages', function(req, res) {
    var message = new Message();

    message.channel_id = req.body.channel_id;
    message.response_to = req.body.response_to;
    message.content = req.body.content;

    // save the bear and check for errors
    message.save(function(err) {
        if (err)
            res.json({ message: 'Error creating message',
                       Error: err});

        res.json({ message: message,
                   Error: ""});
    });


});


router.get('/messages', function(req, res) {
    hashtag = req.query.hashtag;
    count = req.query.count;
    start = req.query.start;

    Message.find({channel_id: req.query.channel_id},
        function (err, messages) {
            if(err) res.json({messages, Error:err});

            // start filter
            if (start !== undefined){
                messages = messages.slice(parseInt(start));
            };

            // count filter
            if (count !== undefined){
                messages = messages.slice(0,parseInt(count));
            };

            //hashtag filter
            if (hashtag !== undefined){
                with_hashtag = []
                for (i = 0; i < messages.length;i++){
                    list = messages[i].content.split(" ");
                    if (list.indexOf("#" + hashtag) >= 0){
                        with_hashtag.push(messages[i])
                    }
                };
                messages = with_hashtag
            }
            
            //filtrar solo si hashtag in message.content +++++ su split y chao
            //obtener solo el numero de count +++++ su corte a la lista y chao
            //partir la cuenta desde start +++++ 
            res.json({messages, Error:""});
    });

});


app.use('/', router);

app.listen(port);
console.log('Message service listening on port' + port);
