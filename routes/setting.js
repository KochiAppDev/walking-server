var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/', function(request, response, next) {
    var user_id = request.params.id;
    var conf0 = request.params.c0;
    var conf1 = request.params.c1;
    var conf2 = request.params.c2;
    var conf3 = request.params.c3;
    var conf4 = request.params.c4;
    var conf5 = request.params.c5;
    var conf6 = request.params.c6;
    var conf7 = request.params.c7;
    var conf8 = request.params.c8;
    var conf9 = request.params.c9;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_info SET conf0=$1, conf1=$2, conf2=$3, conf3=$4, conf4=$5, conf5=$6, conf6=$7, conf7=$8, conf8=$9, conf9=$10, update_time=now() WHERE user_id=$11",
            [conf0, conf1, conf2, conf3, conf4, conf5, conf6, conf7, conf8, conf9, user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "result": -1 });
                } else {
                    response.json({ "result": 1 });
                }
                client.end();
            }
        );
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
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_info SET conf0=$1, conf1=$2, conf2=$3, conf3=$4, conf4=$5, conf5=$6, conf6=$7, conf7=$8, conf8=$9, conf9=$10, update_time=now() WHERE user_id=$11",
            [conf0, conf1, conf2, conf3, conf4, conf5, conf6, conf7, conf8, conf9, user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "result": -1 });
                } else {
                    response.json({ "result": 1 });
                }
                client.end();
            }
        );
    });
});
 
module.exports = router;