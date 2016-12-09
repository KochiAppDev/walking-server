var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
var fcmCli = require('../lib/fcm');;

var stampAction = function(response, client, done, user_id, receive_id, message) {
    client.query(
        "SELECT user_name, group_id FROM user_info WHERE user_id=$1 AND group_id>=0",
       [user_id],
       function(err, result) {
           if (err) {
                done();
                console.log(err);
                response.status(500).json({ "message_id": -1 });
           } else {
               var title = result.rows[0].user_name + " から";
               var group_id = result.rows[0].group_id;
               insertMessage(response, client, done, user_id, receive_id, title, message, group_id);
           }
       }
    );
};

var insertMessage = function(response, client, done, user_id, receive_id, title, message, group_id) {
    client.query(
        "INSERT INTO message (message_from, message_to, message_type, icon, create_time) VALUES ($1, $2, 1, $3, now()) RETURNING message_id",
        [user_id, receive_id, message],
        function(err, result) {
            if (err) {
                done();
                console.log(err);
                response.status(500).json({ "message_id": -1 });
            } else {
                var message_id = result.rows[0].message_id;
                response.status(200).json({ "message_id": message_id });
                if (receive_id == -1) {
                    // グループ送信
                    groupMember(client, done, user_id, group_id, message_id, title, message);
                } else {
                    // 1対1送信
                    singleMember(client, done, user_id, receive_id, message_id, title, message)
                }
            }
        }
    );
};

var groupMember = function(client, done, user_id, group_id, message_id, title, message) {
    var ids = [];
    client.query(
        "SELECT token FROM user_info WHERE user_id!=$1 AND group_id=$2",
       [user_id, group_id],
       function(err, result) {
           done();
           if (err) {
               console.log(err);
           } else {
               for (var i = 0; i < result.rows.length; i++) {
                   ids[i] = result.rows[i].token;
               }
               sendMulticast(ids, user_id, message_id, title, message);
           }
       }
    );
};

var singleMember = function(client, done, user_id, to_id, message_id, title, message) {
    var ids = [];
    client.query(
        "SELECT token FROM user_info WHERE user_id=$1",
       [to_id],
       function(err, result) {
           done();
           if (err) {
               console.log(err);
           } else {
               var to_id = result.rows[0].token;
               sendSingle(to_id, user_id, message_id, title, message);
           }
       }
    );
};
 
var sendMulticast = function(ids, from_id, message_id, title, message) {
    if (ids.length >= 0) {
        var payload = {
            registration_ids:ids,
            data: {
                order : "message",
                message : message_id,
                type : 1,
                stamp : message,
                sender : from_id
            },
            priority: 'high',
            content_available: true,
            notification: { title : title, body : "スタンプが届いています", sound : "default", badge: "1" }
        };

        fcmCli.send(payload,function(err,res){
            console.log("###[ err=" + err + ", res=" + res + "]");
        });
    }
};

var sendSingle = function(to_id, from_id, message_id, title, message) {
   var payload = {
       to:to_id,
       data: {
           order : "message",
           message : message_id,
           type : 1,
           stamp : message,
           sender : from_id
       },
       priority: 'high',
       content_available: true,
       notification: { title : title, body : "スタンプが届いています", sound : "default", badge: "1" }
   };

   fcmCli.send(payload,function(err,res){
       console.log("###[ err=" + err + ", res=" + res + "]");
   });
};
 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var receive_id = request.query.to;
    var message = request.query.ms;
    
    pool.connect(function(err, client, done) {
        stampAction(response, client, done, user_id, receive_id, message);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var receive_id = request.body.to;
    var message = request.body.ms;
    
    pool.connect(function(err, client, done) {
        stampAction(response, client, done, user_id, receive_id, message);
    });
});
 
module.exports = router;