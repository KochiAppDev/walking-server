var express = require('express');
var router = express.Router();
var pg = require('pg');
 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var receive_id = request.query.to;
    var message = request.query.ms;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "INSERT INTO message (message_from, message_to, message_type, image, create_time) VALUES ($1, $2, 2, $3, now()) RETURNING id",
            [user_id, receive_id, message],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "message_id": -1 });
                } else {
                    response.json(result.rows[0]);
                }
                client.end();
            }
        );
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var receive_id = request.body.to;
    var message = request.body.ms;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "INSERT INTO message (message_from, message_to, message_type, image, create_time) VALUES ($1, $2, 2, $3, now()) RETURNING id",
            [user_id, receive_id, message],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "message_id": -1 });
                } else {
                    response.json(result.rows[0]);
                }
                client.end();
            }
        );
    });
});
 
module.exports = router;