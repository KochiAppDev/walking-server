var express = require('express');
var router = express.Router();
var pg = require('pg');

var FCM = require('fcm-node');
var SERVER_API_KEY = process.env.FCM_API_KEY;
var fcmCli= new FCM(SERVER_API_KEY);

var addAction = function(response, client, u1, u2) {
    var group_id = -1;
    client.query(
        "SELECT group_id, user_id, user_type FROM user_info WHERE user_id IN ($1, $2) ORDER BY user_type, user_id",
       [u1, u2],
       function(err, result) {
           if (err) {
               console.log(err);
               response.status(500).json({ "group_id": -1 });
               client.end();
           } else {
               if (result.rows.length == 2) {
                   if (result.rows[0].group_id == -1) {
                       if (result.rows[1].group_id == -1) {
                           group_id = result.rows[0].user_id;
                       } else {
                           group_id = result.rows[1].group_id;
                       }
                   } else {
                       if (result.rows[1].group_id == -1) {
                           group_id = result.rows[0].group_id;
                       }
                   }
               }
               
               if (group_id == -1) {
                   // 存在しないユーザ or すでに別グループに存在
                   console.log(err);
                   response.status(500).json({ "group_id": -1 });
                   client.end();
               } else {
                   addMembers(response, client, u1, u2, group_id);
               }
           }
       }
    );
};

var addMembers = function(response, client, u1, u2, group_id) {
    client.query(
        "UPDATE user_info SET group_id=$1, update_time=now() WHERE user_id IN ($2, $3)",
       [group_id, u1, u2],
       function(err, result) {
           if (err) {
               console.log(err);
               response.status(500).json({ "group_id": -1 });
               client.end();
           } else {
               response.status(200).json({ "group_id": group_id });
               groupMember(client, group_id);
           }
       }
    );
};

var groupMember = function(client, group_id) {
    var ids = [];
    client.query(
        "SELECT token FROM user_info WHERE group_id=$1",
       [group_id],
       function(err, result) {
           if (err) {
               console.log(err);
           } else {
               for (var i = 0; i < result.rows.length; i++) {
                   ids[i] = result.rows[i].token;
               }
           }
           client.end();
           sendMulticast(ids, group_id);
       }
    );
};

var sendMulticast = function(ids, group_id) {
    if (ids.length >= 0) {
        var payload = {
            registration_ids:ids,
            data: {
                order : "group",
                group : group_id
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
    var user1_id = request.query.u1;
    var user2_id = request.query.u2;

    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        addAction(response, client, user1_id, user2_id);
    });  
});

router.post('/', function(request, response, next) {
    var user1_id = request.body.u1;
    var user2_id = request.body.u2;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        addAction(response, client, user1_id, user2_id);
    });  
});
 
module.exports = router;