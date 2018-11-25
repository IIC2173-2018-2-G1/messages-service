const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

var port = process.env.PORT || 8083;

mongoose
  .connect(
    process.env.DB,
    { useNewUrlParser: true }
  )
  .catch(() => process.exit(1));

require("./models/message");
require("./models/hashtag");
app.use(require("./routes"));

app.listen(port);
console.log("Message service listening on port " + port);
