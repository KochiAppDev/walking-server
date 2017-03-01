var express = require('express');
var router = express.Router();
var fcmCli = require('../lib/fcm');;

var sendSingle = function(to_id, from_id, message_id, title, message) {
    var payload = {
        to:to_id,
        data: {
            order : "message",
            message : message_id,
            type : 0,
            sender : from_id
        },
        priority: 'high',
        content_available: true,
        notification: { title : title, body : message, "sound" : "", badge: "-1" }
    };

    fcmCli.send(payload,function(err,res){
        console.log("###[ err=" + err + ", res=" + res + "]");
    });
};
 
router.get('/', function(request, response, next) {
    var to_id = request.query.to;
    var title = request.query.tt;
    var message = request.query.ms;

    var payload = {
        to:to_id,
        data: {
            order : "message",
            message : 999,
            type : 0,
            sender : 999
        },
        priority: 'high',
        content_available: true,
        notification: { title : title, body : message, "sound" : "", badge: "-1" }
    };

    fcmCli.send(payload,function(err,res){
        console.log("###[ err=" + err + ", res=" + res + "]");
    });
});
 
module.exports = router;