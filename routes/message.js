var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
 
var messageAction = function(response, client, done, message_id) {
    client.query(
        "SELECT message_id as id, message_from as from, message_type as type, (CASE message_type WHEN 1 THEN to_char(icon, '9') WHEN 2 THEN image ELSE plain END) as ms, create_time as ts FROM message WHERE message_id=$1",
        [message_id],
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json({"id" : -1});
            } else {
                response.status(200).json(result.rows[0]);
            }
        }
    );
};

router.get('/', function(request, response, next) {
    var message_id = request.query.id;
    
    pool.connect(function(err, client, done) {
        messageAction(response, client, done, message_id);
    });
});
 
router.post('/', function(request, response, next) {
    var message_id = request.body.id;
    
    pool.connect(function(err, client, done) {
        messageAction(response, client, done, message_id);
    });
});
 
module.exports = router;