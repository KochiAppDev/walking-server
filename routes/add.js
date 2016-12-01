var express = require('express');
var router = express.Router();
var pg = require('pg');

var FCM = require('fcm-node');
var SERVER_API_KEY = process.env.FCM_API_KEY;
var fcmCli= new FCM(SERVER_API_KEY);

router.post('/', function(request, response, next) {
    var user1_id = request.body.u1;
    var user2_id = request.body.u2;
    var group_id = request.body.gp;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_info SET group_id=$1, update_time=now() WHERE user_id IN ($2, $3)",
            [group_id, user1_id, user2_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "group_id": -1 });
                    client.end();
                } else {
                    response.json({ "group_id": group_id });

                    client.query(
                        "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group, token FROM user_info WHERE group_id=$1 ORDER BY user_type",
                        [group_id],
                        function(err, result) {
                            if (err) {
                                console.log(err);
                                client.end();
                            } else {
                                var ids = [];
                                for (var j = 0; j < result.rows.length; j++) {
                                    ids[j] = result.rows[j].token;
                                }

                               var payloadMulticast = {
                                   registration_ids:ids,
                                   data: {
                                       order : "group",
                                       group : group_id,
                                       member: JSON.stringify(result.rows)
                                   },
                                    priority: 'high',
                                    content_available: true,
                                    notification: { sound : "", badge: "0" }
                                };
                                
                                fcmCli.send(payloadMulticast,function(err,res){
                                    console.log("###[ err=" + err + ", res=" + res + "]");
                                });
                                client.end();
                            }
                        }
                    );
                }
            }
        );
    });
});
 
module.exports = router;