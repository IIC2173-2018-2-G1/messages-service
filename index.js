
const express    = require('express');
const path       = require('path');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const cors       = require('cors');
const app        = express();

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 8083;

var router = express.Router();

mongoose.connect('mongodb://mongodb:27017/messages',{ useNewUrlParser: true });
mongoose.set('debug', true);


require('./models/messages');
app.use(require('./routes'));

app.listen(port);
console.log('Message service listening on port' + port);
