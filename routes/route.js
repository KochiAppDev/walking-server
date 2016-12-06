var express = require('express');
var router = express.Router();
var pg = require('pg');

var FCM = require('fcm-node');
var SERVER_API_KEY = process.env.FCM_API_KEY;
var fcmCli= new FCM(SERVER_API_KEY);

var routeAction = function(response, client, user_id, route) {
    client.query(
        "UPDATE user_location SET route=$1 WHERE user_id=$2",
        [route, user_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json([]);
                client.end();
            } else {
                response.status(200).json(result.rows[0]);
                singleMember(client, user_id);
            }
        }
    );
};

var singleMember = function(client, to_id) {
    var ids = [];
    client.query(
        "SELECT token FROM user_info WHERE user_id=$1",
       [to_id],
       function(err, result) {
           if (err) {
               console.log(err);
           } else {
               var to_id = result.rows[0].token;
               sendSingle(to_id);
           }
           client.end();
       }
    );
};
 
var sendSingle = function(to_id) {
   var payload = {
       to:to_id,
       data: {
           order : "route"
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
    var route = request.query.rt;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        routeAction(response, client, user_id, route);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var route = request.body.rt;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        routeAction(response, client, user_id, route);
    });
});
 
module.exports = router;