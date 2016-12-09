var pg = require('pg');
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: false
};

var pool;

function connectDatabase() {
    if (!pool) {
        console.log("[" + auth[0] + ":" + auth[1] + "] @(" + params.hostname + ":" + params.port + ")[" + params.pathname.split('/')[1] + "]");
        pool = new pg.Pool(config);
    }
    return pool;
}

module.exports = connectDatabase();