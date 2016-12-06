var express = require('express');
var router = express.Router();
var pg = require('pg');
 
var tokenAction = function(response, client, user_id, token, os, ver) {
    client.query(
        "UPDATE user_info SET os_type=$1, os_version=$2, token=$3, update_time=now() WHERE user_id=$4",
        [os, ver, token, user_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json({ "result": -1 });
            } else {
                response.status(200).json({ "result": 1 });
            }
            client.end();
        }
    );
};
 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var token = request.query.tk;
    var os = request.query.os;
    var ver = request.query.vr;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        tokenAction(response, client, user_id, token, os, ver);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var token = request.body.tk;
    var os = request.body.os;
    var ver = request.body.vr;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        tokenAction(response, client, user_id, token, os, ver);
    });
});
 
module.exports = router;