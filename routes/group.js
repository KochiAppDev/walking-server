var express = require('express');
var router = express.Router();
var pg = require('pg');

var groupAction = function(response, client, group_id) {
    client.query(
        "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group FROM user_info WHERE group_id=$1 ORDER BY user_type",
        [group_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows);
            }
            client.end();
        }
    );
};

router.get('/', function(request, response, next) {
    var group_id = request.query.gp;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        groupAction(response, client, group_id);
    });
});

router.post('/', function(request, response, next) {
    var group_id = request.body.gp;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        groupAction(response, client, group_id);
    });
});

module.exports = router;