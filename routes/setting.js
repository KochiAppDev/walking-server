var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
var fcmCli = require('../lib/fcm');;

var settingAction = function(response, client, done, user_id, conf0, conf1, conf2, conf3, conf4, conf5, conf6, conf7, conf8, conf9) {
    client.query(
        "UPDATE user_info SET conf0=$1, conf1=$2, conf2=$3, conf3=$4, conf4=$5, conf5=$6, conf6=$7, conf7=$8, conf8=$9, conf9=$10, update_time=now() WHERE user_id=$11",
        [conf0, conf1, conf2, conf3, conf4, conf5, conf6, conf7, conf8, conf9, user_id],
        function(err, result) {
            if (err) {
                done();
                console.log(err);
                response.status(500).json({ "result": -1 });
            } else {
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
           order : "setting"
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
    var conf0 = request.query.c0;
    var conf1 = request.query.c1;
    var conf2 = request.query.c2;
    var conf3 = request.query.c3;
    var conf4 = request.query.c4;
    var conf5 = request.query.c5;
    var conf6 = request.query.c6;
    var conf7 = request.query.c7;
    var conf8 = request.query.c8;
    var conf9 = request.query.c9;
    
    pool.connect(function(err, client, done) {
        settingAction(response, client, done, user_id, conf0, conf1, conf2, conf3, conf4, conf5, conf6, conf7, conf8, conf9);
    });
});
  
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var conf0 = request.body.c0;
    var conf1 = request.body.c1;
    var conf2 = request.body.c2;
    var conf3 = request.body.c3;
    var conf4 = request.body.c4;
    var conf5 = request.body.c5;
    var conf6 = request.body.c6;
    var conf7 = request.body.c7;
    var conf8 = request.body.c8;
    var conf9 = request.body.c9;
    
    pool.connect(function(err, client, done) {
        settingAction(response, client, done, user_id, conf0, conf1, conf2, conf3, conf4, conf5, conf6, conf7, conf8, conf9);
    });
});
 
module.exports = router;