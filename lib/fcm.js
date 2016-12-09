var FCM = require('fcm-node');

const SERVER_API_KEY = process.env.FCM_API_KEY;

var fcmCli;

function connectFireBase() {
    if (!fcmCli) {
        fcmCli = new FCM(SERVER_API_KEY);
    }
    return fcmCli;
}

module.exports = connectFireBase();