var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
var fcmCli = require('../lib/fcm');;

var removeAction = function(response, client, done, user_id) {
    var group_id = -1;
    client.query(
        "SELECT group_id FROM user_info WHERE user_id=$1",
       [user_id],
       function(err, result) {
           if (err) {
               done();
               console.log(err);
               response.json({ "result": -1 });
           } else {
               if (result.rows.length == 0) {
                   done();
                   response.json({ "result": -1 });
               } else {
                   group_id = result.rows[0].group_id;
                   if (group_id >= 0) {
                       groupMember(response, client, done, user_id, group_id);
                   } else {
                       done();
                       response.json({ "result": -1 });
                   }
               }
           }
       }
    );
};

var groupMember = function(response, client, done, user_id, group_id) {
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
           otherMember(response, client, done, ids, user_id, group_id);
       }
    );
};


var otherMember = function(response, client, done, ids, user_id, group_id) {
    var u_id = -1;
    client.query(
        "SELECT user_id FROM user_info WHERE group_id=$1 and user_id!=$2",
       [group_id, user_id],
       function(err, result) {
           if (err) {
               console.log(err);
           } else {
               if (result.rows.length == 1) {
                   u_id = result.rows[0].user_id;
               } 
           }
           if (u_id < 0) {
               removeMember(response, client, done, ids, user_id, group_id);
           } else {
               removeMembers(response, client, done, ids, user_id, u_id, group_id);
           }
       }
    );
};

var removeMember = function(response, client, done, ids, u1, group_id) {
    client.query(
        "UPDATE user_info SET group_id=-1, update_time=now() WHERE user_id=$1",
       [u1],
       function(err, result) {
           done();
           if (err) {
               console.log(err);
               response.json({ "result": -1 });
           } else {
               response.json({ "result": 1 });
               sendMulticast(ids, group_id);
           }
       }
    );
};

var removeMembers = function(response, client, done, ids, u1, u2, group_id) {
    client.query(
        "UPDATE user_info SET group_id=-1, update_time=now() WHERE user_id IN ($1, $2)",
       [u1, u2],
       function(err, result) {
           done();
           if (err) {
               console.log(err);
               response.json({ "result": -1 });
           } else {
               response.json({ "result": 1 });
               if (ids.length >= 0) {
                   sendMulticast(ids, group_id);
               }
           }
       }
    );
};


var sendMulticast = function(ids, group_id) {
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
};

 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    
    pool.connect(function(err, client, done) {
        removeAction(response, client, done, user_id);
    });  
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    pool.connect(function(err, client, done) {
        removeAction(response, client, done, user_id);
    });  
});
 
module.exports = router;