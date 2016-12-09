var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
 
var tokenAction = function(response, client, done, user_id, token, os, ver) {
    client.query(
        "UPDATE user_info SET os_type=$1, os_version=$2, token=$3, update_time=now() WHERE user_id=$4",
        [os, ver, token, user_id],
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json({ "result": -1 });
            } else {
                response.status(200).json({ "result": 1 });
            }
        }
    );
};
 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var token = request.query.tk;
    var os = request.query.os;
    var ver = request.query.vr;
    
    pool.connect(function(err, client, done) {
        tokenAction(response, client, done, user_id, token, os, ver);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var token = request.body.tk;
    var os = request.body.os;
    var ver = request.body.vr;
    
    pool.connect(function(err, client, done) {
        tokenAction(response, client, done, user_id, token, os, ver);
    });
});
 
module.exports = router;