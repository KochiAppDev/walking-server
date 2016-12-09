var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
var fcmCli = require('../lib/fcm');;

var routeAction = function(response, client, done, user_id, route) {
    client.query(
        "UPDATE user_info SET route=$1 WHERE user_id=$2",
        [route, user_id],
        function(err, result) {
            if (err) {
                done();
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows[0]);
                singleMember(client, done, user_id);
            }
        }
    );
};

var singleMember = function(client, done, to_id) {
    var ids = [];
    client.query(
        "SELECT token FROM user_info WHERE user_id=$1",
       [to_id],
       function(err, result) {
           done();
           if (err) {
               console.log(err);
           } else {
               if (result.rows.length >= 0) {
                   var to_id = result.rows[0].token;
                   sendSingle(to_id);
               }
           }
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
    
    pool.connect(function(err, client, done) {
        routeAction(response, client, done, user_id, route);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var route = request.body.rt;
    
    pool.connect(function(err, client, done) {
        routeAction(response, client, done, user_id, route);
    });
});
 
module.exports = router;