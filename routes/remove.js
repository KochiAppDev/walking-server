var express = require('express');
var router = express.Router();
var pg = require('pg');
var FCM = require('fcm-node');
var SERVER_API_KEY = process.env.FCM_API_KEY;
var fcmCli= new FCM(SERVER_API_KEY);
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "SELECT group_id FROM user_info WHERE user_id=$1",
            [user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "result": -1 });
                    client.end();
                } else {
                    var group_id = -1;
                    group_id = result.rows[0].group_id;
                    if (group_id == -1) {
                        response.json({ "result": -1 });
                        client.end();
                    } else {
                        client.query(
                            "UPDATE user_info SET group_id=-1, update_time=now() WHERE user_id=$1",
                            [user_id],
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                    response.json({ "result": -1 });
                                    client.end();
                                } else {
                                    // push 
                                    response.json({ "result": 1 });
                                    
                                    client.query(
                                        "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group, token FROM user_info WHERE group_id=$1 ORDER BY user_type",
                                        [group_id],
                                        function(err, result) {
                                            if (err) {
                                                console.log(err);
                                                client.end();
                                            } else {
                                                if (result.rows.length == 1) {
                                                    var single = result.rows[0].id;
                                                    var ids = result.rows[0].token;
                                                    client.query(
                                                        "UPDATE user_info SET group_id=-1, update_time=now() WHERE user_id=$1",
                                                        [single],
                                                        function(err, result) {
                                                            if (err) {
                                                                console.log(err);
                                                                client.end();
                                                            } else {
                                                                var payload = {
                                                                    to:ids,
                                                                    data: {
                                                                        order : "group",
                                                                        group : group_id,
                                                                        member: JSON.stringify([])
                                                                    },
                                                                    priority: 'high',
                                                                    content_available: true,
                                                                    notification: { sound : "", badge: "0" }
                                                                };
                                                                fcmCli.send(payload,function(err,res){
                                                                    console.log("###[ err=" + err + ", res=" + res + "]");
                                                                });
                                                                client.end();
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    var ids = [];
                                                    for (var j = 0; j < result.rows.length; j++) {
                                                        ids[j] = result.rows[j].token;
                                                    }
                                                    var payload = {
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
                                                
                                                    fcmCli.send(payload,function(err,res){
                                                        console.log("###[ err=" + err + ", res=" + res + "]");
                                                    });
                                                    client.end();
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    });
});
 
module.exports = router;