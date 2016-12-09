var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');

var deviceAction = function(response, client, done, device_id, token, os, ver) {
    console.log("#call deviceAction");
    client.query(
        "SELECT user_id FROM user_info WHERE device=$1",
        [device_id],
        function(err, result) {
            if (err) {
                done();
                console.log(err);
                response.status(500).json({ "user_id": -1 });
            } else {
                if (result.rows.length == 0) {
                    client.query(
                        "INSERT INTO user_info (os_type, os_version, token, device, update_time) VALUES ($1, $2, $3, $4, now()) RETURNING user_id",
                        [os, ver, token, device_id],
                        function(err, result) {
                            done();
                            if (err) {
                                console.log(err);
                                response.status(500).json({ "user_id": -1 });
                            } else {
                                response.status(200).json(result.rows[0]);
                            }
                        }
                    );
                } else {
                    var user_id = result.rows[0].user_id;
                    client.query(
                        "UPDATE user_info SET os_type=$1, os_version=$2, update_time=now() WHERE user_id=$3",
                        [os, ver, user_id],
                        function(err, result) {
                            done();
                            if (err) {
                                console.log(err);
                                response.status(500).json({ "user_id": -1 });
                            } else {
                                response.status(200).json({ "user_id": user_id });
                            }
                        }
                    );
                }
            }
        }
    );
};

 
router.get('/', function(request, response, next) {
    var device_id = request.query.id;
    var token = request.query.tk;
    var os = request.query.os;
    var ver = request.query.vr;

    pool.connect(function(err, client, done) {
        deviceAction(response, client, done, device_id, token, os, ver);
    });

});
 
router.post('/', function(request, response, next) {
    var device_id = request.body.id;
    var token = request.body.tk;
    var os = request.body.os;
    var ver = request.body.vr;
    
    pool.connect(function(err, client, done) {
        deviceAction(response, client, done, device_id, token, os, ver);
    });
});
 
module.exports = router;
