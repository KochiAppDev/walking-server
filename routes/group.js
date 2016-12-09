var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');

var groupAction = function(response, client, done, group_id) {
    client.query(
        "SELECT user_id as id, user_name as name, user_type as type, icon, group_id as group FROM user_info WHERE group_id=$1 ORDER BY user_type",
        [group_id],
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows);
            }
        }
    );
};

router.get('/', function(request, response, next) {
    var group_id = request.query.gp;
    
    pool.connect(function(err, client, done) {
        groupAction(response, client, done, group_id);
    });
});

router.post('/', function(request, response, next) {
    var group_id = request.body.gp;
    
    pool.connect(function(err, client, done) {
        groupAction(response, client, done, group_id);
    });
});

module.exports = router;