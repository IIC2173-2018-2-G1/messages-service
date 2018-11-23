const mongoose = require("mongoose");
const router = require("express").Router();
const Message = mongoose.model("Message");
const axios = require("axios");
const { required_members } = require("../utils");

const re = /(?:^|\s)#([^\s]+)\b/g;

router.post("/", function(req, res) {
  if (!required_members(req.body, ["channel_id", "content"], res)) return;

  const {
    body: { channel_id, response_to, content }
  } = req;
  const user_id = req.header("X-User-ID");

  // get hashtags in message
  const hashtags = [];
  let match;
  while ((match = re.exec(content))) {
    hashtags.push(match[1]);
  }

  const message = new Message();
  message.user_id = user_id;
  message.content = content;
  message.channel_id = channel_id;
  message.created_on = new Date();

  if (response_to !== undefined){
    Message.findById(response_to, function(error, message_found){
      if(error){
        res.status(500).json({ error })
      } else {
        message.response_to = response_to;
      }
    });
  } 
  message
    .save()
    .then(message => {
      if (hashtags.length > 0) {
        console.log({ message_id: message.id, hashtags });
        axios.post("http://hashtag-service:8085/", {
          message_id: message.id,
          hashtags
        });
      }
      res.status(200).json(message.toJSON());
    })
    .catch(error => res.status(500).json({ error }));
});

router.get("/", function(req, res) {
  let { channel_id, start, count, hashtag } = req.query;
  start = parseInt(start) || 0;
  const limit = parseInt(count) || 50;

  if (typeof channel_id !== "undefined") {
    Message.find({ channel_id })
      .select([
        "id",
        "user_id",
        "channel_id",
        "response_to",
        "content",
        "created_on"
      ])
      .limit(limit)
      .skip(start)
      .sort({ created_on: "desc" })
      .exec()
      .then(messages => res.json(messages))
      .catch(error => res.status(500).json({ error }));
  } else if (typeof hashtag !== "undefined") {
    mongoose.connection.db
      .collection("hashtags")
      .aggregate([
        { $match: { name: hashtag } },
        { $unwind: "$messages" },
        {
          $addFields: {
            message_id: { $toObjectId: "$messages" }
          }
        },
        {
          $lookup: {
            from: "messages",
            localField: "message_id",
            foreignField: "_id",
            as: "message"
          }
        },
        { $unwind: "$message" },
        { $replaceRoot: { newRoot: "$message" } },
        {
          $project: {
            _id: 0,
            id: "$_id",
            user_id: 1,
            channel_id: 1,
            response_to: 1,
            content: 1,
            created_on: 1
          }
        }
      ])
      .toArray()
      .then(messages => res.json(messages))
      .catch(error => res.status(500).json({ error }));
  } else {
    res
      .status(405)
      .json({ error: "must define at least one of `channel_id` or `hashtag`" });
  }
});

module.exports = router;
