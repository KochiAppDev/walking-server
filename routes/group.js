var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/', function(request, response, next) {
    var group_id = request.query.gp;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group FROM user_info WHERE group_id=$1 ORDER BY user_type",
            [group_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json([]);
                } else {
                    response.json(result.rows);
                }
                client.end();
            }
        );
    });
});

router.post('/', function(request, response, next) {
    var group_id = request.body.gp;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group FROM user_info WHERE group_id=$1 ORDER BY user_type",
            [group_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json([]);
                } else {
                    response.json(result.rows);
                }
                client.end();
            }
        );
    });
});

module.exports = router;