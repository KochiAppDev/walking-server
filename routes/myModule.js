var FCM = require('fcm-node');
var SERVER_API_KEY = process.env.FCM_API_KEY;
var fcmCli= new FCM(SERVER_API_KEY);

var callbackLog = function (sender, err, res) {
    console.log("\n__________________________________")
    console.log("\t"+sender);
    console.log("----------------------------------")
    console.log("err="+err);
    console.log("res="+res);
    console.log("----------------------------------\n>>>");
};

var silentNotificationS = function (_ids, _data) {
    var payload = {
        to: _ids,
        data: _data,
        priority: 'high',
        content_available: true,
        notification: { sound : "", badge: "0" }
    };
    fcmCli.send(payload, function(err,res) {
        callbackLog('silentNotification Single',err,res);
    });    
};

var silentNotificationM = function (_ids, _data) {
    var payload = {
        registration_ids:_ids,
        data: _data,
        priority: 'high',
        content_available: true,
        notification: { sound : "", badge: "0" }
    };
    fcmCli.send(payload, function(err,res) {
        callbackLog('silentNotification Multicast',err,res);
    });    
};

var messageNotificationS = function (_ids, _data, _title, _body) {
    var payload = {
        to: _ids,
        data: _data,
        priority: 'high',
        content_available: true,
        notification: { title: _title, body: _body, sound : "default", badge: "1" }
    };
    fcmCli.send(payload, function(err,res) {
        callbackLog('messageNotification Single',err,res);
    });    
};

var messageNotificationM = function (_ids, _data, _title, _body) {
    var payload = {
        registration_ids:_ids,
        data: _data,
        priority: 'high',
        content_available: true,
        notification: { title: _title, body: _body, sound : "default", badge: "1" }
    };
    fcmCli.send(payload, function(err,res) {
        callbackLog('messageNotification Multicast',err,res);
    });    
};

exports.silentNotification = function (_ids, _data) {
    if (!_ids || _ids.length == 0) return;
    
    if (_ids.length == 1) {
        silentNotificationS(_ids[0], _data);
    } else {
        silentNotificationM(_ids, _data);
    }
};

exports.messageNotification = function (_ids, _data, _title, _body) {
    if (!_ids || _ids.length == 0) return;
    
    if (_ids.length == 1) {
        messageNotificationS(_ids[0], _data, _title, _body);
    } else {
        messageNotificationM(_ids, _data, _title, _body);
    }
};

exports.pushNotification = function (_ids, _data, _title, _body) {
    if (!_ids || _ids.length == 0) return;
    
    if (_ids.length == 1) {
        if (_title) {
            silentNotificationS(_ids[0], _data);
        } else {
            messageNotificationS(_ids[0], _data, _title, _body);
        }
    } else {
        if (_title) {
            silentNotificationM(_ids[0], _data);
        } else {
            messageNotificationM(_ids[0], _data, _title, _body);
        }
    }
};