var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/', function(request, response, next) {
    var user_id = request.params.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group, conf0 as c0, conf1 as c1, conf2 as c2, conf3 as c3, conf4 as c4, conf5 as c5, conf6 as c6, conf7 as c7, conf8 as c8, conf9 as c9 FROM user_info WHERE user_id=$1",
            [user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "id": -1 });
                } else {
                    response.json(result.rows[0]);
                }
                client.end();
            }
        );
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group, conf0 as c0, conf1 as c1, conf2 as c2, conf3 as c3, conf4 as c4, conf5 as c5, conf6 as c6, conf7 as c7, conf8 as c8, conf9 as c9 FROM user_info WHERE user_id=$1",
            [user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "id": -1 });
                } else {
                    response.json(result.rows[0]);
                }
                client.end();
            }
        );
    });
});
 
module.exports = router;