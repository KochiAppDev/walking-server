var express = require('express');
var router = express.Router();
var pg = require('pg');
 
var messageAction = function(response, client, message_id) {
    client.query(
        "SELECT message_id as id, message_from as from, message_type as type, (CASE message_type WHEN 1 THEN to_char(icon, '9') WHEN 2 THEN image ELSE plain END) as ms, create_time as ts FROM message WHERE message_id=$1",
        [message_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json({"id" : -1});
            } else {
                response.status(200).json(result.rows[0]);
            }
            client.end();
        }
    );
};

router.get('/', function(request, response, next) {
    var message_id = request.query.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        messageAction(response, client, message_id);
    });
});
 
router.post('/', function(request, response, next) {
    var message_id = request.body.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        messageAction(response, client, message_id);
    });
});
 
module.exports = router;