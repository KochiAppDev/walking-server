var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
var fcmCli = require('../lib/fcm');;

var configAction = function(response, client, done, user_id, user_name, icon) {
    client.query(
        "UPDATE user_info SET user_name=$1, icon=$2, update_time=now() WHERE user_id=$3",
        [user_name, icon, user_id],
        function(err, result) {
            if (err) {
                done();
                console.log(err);
                response.status(500).json({ "result": -1 });
            } else {
                response.status(200).json({ "result": 1 });
                groupMember(client, done, user_id);
            }
        }
    );
};
 
var groupMember = function(client, done, user_id) {
    var ids = [];
    client.query(
        "SELECT token FROM user_info WHERE group_id >= 0 AND group_id=(SELECT group_id FROM user_info WHERE user_id=$1)",
       [user_id],
       function(err, result) {
           done();
           if (err) {
               console.log(err);
           } else {
               for (var i = 0; i < result.rows.length; i++) {
                   ids[i] = result.rows[i].token;
               }
           }
           sendMulticast(ids, user_id);
       }
    );
};
 
var sendMulticast = function(ids, user_id) {
    if (ids.length >= 0) {
        var payload = {
            registration_ids:ids,
            data: {
                order : "config",
                user : user_id
            },
            priority: 'high',
            content_available: true,
            notification: { sound : "", badge: "-1" }
        };

        fcmCli.send(payload,function(err,res){
            console.log("###[ err=" + err + ", res=" + res + "]");
        });
    }
};
 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var user_name = request.query.nm;
    var icon = request.query.ic;
    
    pool.connect(function(err, client, done) {
        configAction(response, client, done, user_id, user_name, icon);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var user_name = request.body.nm;
    var icon = request.body.ic;
    
    pool.connect(function(err, client, done) {
        configAction(response, client, done, user_id, user_name, icon);
    });
});
 
module.exports = router;
