var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');

router.get('/', function(request, response, next) {

//var SERVER_API_KEY='AIzaSyBt0-qkQ9BJeNyBMY13JzlTsTQANjaYzNs';
var SERVER_API_KEY='AIzaSyDhzH16LFOzQpO5k56OGziSlQ7VeXzLvb4';

var validDeviceRegistrationToken = 'fBXdtVEIzrY:APA91bHSFRfhUmQyVAsfOmMnBE1RBocZXxSgNNROu6NUQTXPnf3OxwgIpIBd8C0tK0TlYlpDWxM105LovyUSvxTmXDq-bPoZ7IeIifaKicBIcSy3cq800PzfcjQlPOc6O_cj1N4tSxE4';

var fcmCli= new FCM(SERVER_API_KEY);

var payloadOK = {
    to: validDeviceRegistrationToken,
    data: { //some data object (optional)
        url: 'news',
        foo:'fooooooooooooo',
        bar:'bar bar bar'
    },
    priority: 'high',
    content_available: true
    ,notification: { //notification object
        sound : "", badge: "0"
    }
//    ,notification: { //notification object
//        title: 'HELLO', body: 'World!', sound : "default", badge: "1"
//    }
};

var payloadError = {
    to: "4564654654654654", //invalid registration token
    data: {
        url: "news"
    },
    priority: 'high',
    content_available: true,
    notification: { title: 'TEST HELLO', body: '123', sound : "default", badge: "1" }
};

var payloadMulticast = {
    registration_ids:["4564654654654654",
        '123123123',
        validDeviceRegistrationToken, //valid token among invalid tokens to see the error and ok response
        '123133213123123'],
    data: {
        url: "news"
    },
    priority: 'high',
    content_available: true,
    notification: { title: 'Hello', body: 'Multicast', sound : "default", badge: "1" }
};

var callbackLog = function (sender, err, res) {
    console.log("\n__________________________________")
    console.log("\t"+sender);
    console.log("----------------------------------")
    console.log("err="+err);
    console.log("res="+res);
    console.log("----------------------------------\n>>>");
};

function sendOK()
{
    fcmCli.send(payloadOK,function(err,res){
        callbackLog('sendOK',err,res);
    });
}

function sendError() {
    fcmCli.send(payloadError,function(err,res){
        callbackLog('sendError',err,res);
    });
}

function sendMulticast(){
    fcmCli.send(payloadMulticast,function(err,res){
        callbackLog('sendMulticast',err,res);
    });
}


sendOK();
//sendMulticast();
//sendError();


    response.json({ "result": "end" });
});
 
module.exports = router;
