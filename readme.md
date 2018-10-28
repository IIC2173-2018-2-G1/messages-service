# Message Service
This is the message microservice. It will be in charge of creating new messages. New messages will come from a user, will be in a channel and may or may not be a response to another message (whatsapp or telegram like). 

This microservice uses the authentication microservice to validate requests.

# This service should allow inbound HTTP requests on port 8083

## Admitted Requests

- New Message:
> POST /message
```javascript
{
    channel_id: integer
    response_to: integer (default: 0)
    content: string
}
```

> Response:
```javascript
{
    message: message_object,
    Error: string (default: "")
}
```

- Get messages (validate):
> GET /messages/{content}

> Example: /messages?channel_id=1&hashtag=""&count=10&start=0
```javascript
{
  channel_id: integer,
  hashtag: string (optional),
  count: integer (max_value: 30),
  start: 0
}
```

> Response:
```javascript
{
    messages: [message_object]
    Error: string (default: '')
}
```

# Things to note:
- Before every new message, the request must be validated