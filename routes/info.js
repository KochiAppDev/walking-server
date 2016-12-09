var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');

var infoAction = function(response, client, done, user_id) {
    client.query(
//        "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group, conf0 as c0, conf1 as c1, conf2 as c2, conf3 as c3, conf4 as c4, conf5 as c5, conf6 as c6, conf7 as c7, conf8 as c8, conf9 as c9 FROM user_info WHERE user_id=$1",
        "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group, conf0 as c0, conf1 as c1, conf2 as c2, conf3 as c3, conf4 as c4, conf5 as c5, conf6 as c6, conf7 as c7, conf8 as c8, conf9 as c9, route as rt FROM user_info WHERE user_id=$1",
        [user_id],
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json({ "id": -1 });
            } else {
                response.status(200).json(result.rows[0]);
            }
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    
    pool.connect(function(err, client, done) {
        infoAction(response, client, done, user_id);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    pool.connect(function(err, client, done) {
        infoAction(response, client, done, user_id);
    });
});
 
module.exports = router;