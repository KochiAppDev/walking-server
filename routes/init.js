var express = require('express');
var router = express.Router();
var pg = require('pg');
 
router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var user_name = request.query.nm;
    var user_type = request.query.tp;
    var icon = request.query.ic;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_info SET user_name=$1, user_type=$2, icon=$3, update_time=now() WHERE user_id=$4",
            [user_name, user_type, icon, user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "result": -1 });
                    client.end();
                } else {
                    response.json({ "result": 1 });
                    if (user_type == 1) { // éqãüÇÃèÍçá
                        client.query(
                            "INSERT INTO user_location (user_id, update_time) VALUES ($1, now())",
                            [user_id],
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                client.end();
                            }
                        );
                    } else {
                        client.end();
                    }
                }
            }
        );
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var user_name = request.body.nm;
    var user_type = request.body.tp;
    var icon = request.body.ic;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_info SET user_name=$1, user_type=$2, icon=$3, update_time=now() WHERE user_id=$4",
            [user_name, user_type, icon, user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "result": -1 });
                    client.end();
                } else {
                    response.json({ "result": 1 });
                    if (user_type == 1) { // éqãüÇÃèÍçá
                        client.query(
                            "INSERT INTO user_location (user_id, update_time) VALUES ($1, now())",
                            [user_id],
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                client.end();
                            }
                        );
                    } else {
                        client.end();
                    }
                }
            }
        );
    });
});
 
module.exports = router;