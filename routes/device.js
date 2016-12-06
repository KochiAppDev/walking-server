var express = require('express');
var router = express.Router();
var pg = require('pg');

var deviceAction = function(response, client, device_id, token, os, ver) {
    client.query(
        "INSERT INTO user_info (os_type, os_version, token, device, update_time) VALUES ($1, $2, $3, $4, now()) RETURNING user_id",
        [os, ver, token, device_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json({ "user_id": -1 });
            } else {
                response.status(200).json(result.rows[0]);
            }
            client.end();
        }
    );
};
 
router.get('/', function(request, response, next) {
    var device_id = request.query.id;
    var token = request.query.tk;
    var os = request.query.os;
    var ver = request.query.vr;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        deviceAction(response, client, device_id, token, os, ver);
    });
});
 
router.post('/', function(request, response, next) {
    var device_id = request.body.id;
    var token = request.body.tk;
    var os = request.body.os;
    var ver = request.body.vr;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        deviceAction(response, client, device_id, token, os, ver);
    });
});
 
module.exports = router;
