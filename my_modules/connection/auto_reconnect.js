/**
 * Created by michal on 13.06.15.
 */

var net = require('net');
var Timeout = require("./../../esp_utils/timeout");
var cons = require("./../../esp_utils/my_console").get('AutoReconnect');
var cfg = require('./../../config/esp_config');

var CONNECTION_STATES = {
    Connected: 0,
    Disconnected: 1,
    WaitingForClose: 2,
    WaitingForConnection: 3
};


var CONNECTION_TIMEOUT = cfg.AutoReconnect.CONNECTION_TIMEOUT; //  5 * 1000;          // 3 s
var CONNECTION_DISCONNECTING_TIMEOUT = cfg.AutoReconnect.CONNECTION_DISCONNECTING_TIMEOUT;          // 3 s

/**
 *
 * @param {string} host
 * @param {number} port
 * @param {AutoReconnect~onConnect} onConnect
 * @param {AutoReconnect~onData} onData
 * @param {AutoReconnect~onDisconnect} onDisconnect
 * @param {AutoReconnect~onReconnect} onReconnect
 * @constructor
 */
var AutoReconnect = function (host, port, onConnect, onData, onDisconnect, onReconnect) {
    var t = this;
    var cfg = {port: port, host: host};
    var connectionStatus = CONNECTION_STATES.Disconnected;

    var waitingForDisconnectTimeout = new Timeout(function () {
        cons.error('Disconnect Forced');
        t.connction.destroy();
        // fix
        connectionStatus = CONNECTION_STATES.Disconnected;

    }, CONNECTION_DISCONNECTING_TIMEOUT);

    var timeout = new Timeout(function () {
        cons.error('Disconnect because of timeout');
        connectionStatus = CONNECTION_STATES.WaitingForClose;
        t.connction.end();
        waitingForDisconnectTimeout.arm();
    }, CONNECTION_TIMEOUT);

    var setListeners = function () {

        t.connction.on('data', function (data) {
            timeout.arm();
            if (onData) onData(data);
        });

        t.connction.on('close', function (err) {
            connectionStatus = CONNECTION_STATES.Disconnected;
            waitingForDisconnectTimeout.disarm();
            if (onDisconnect) onDisconnect();
        });

        t.connction.on('error', function (error) {
            cons.error('Connection error: ', error);
            connectionStatus = CONNECTION_STATES.WaitingForClose;
        });

    };

    var connect = function (onConnect) {
        connectionStatus = CONNECTION_STATES.WaitingForConnection;
        t.connction = net.connect(cfg, function () {
            connectionStatus = CONNECTION_STATES.Connected;
            timeout.arm();
            if (onConnect) onConnect();

        });

        setListeners();

    };

    this.send = function (msg) {
        var r = false;
        if (connectionStatus == CONNECTION_STATES.WaitingForClose) {
            cons.log('WaitingForClose');
        }
        else if (connectionStatus == CONNECTION_STATES.WaitingForConnection) {
            cons.log('WaitingForConnection');
        }
        else if (connectionStatus == CONNECTION_STATES.Disconnected) {
            cons.log('Disconnected');
            connect(onReconnect);
        }
        else if (connectionStatus == CONNECTION_STATES.Connected) {
            cons.log('Connected');
            t.connction.write(msg);
            r = true;
        }
        return r;
    };

    connect(onConnect);
};

module.exports = AutoReconnect;

/**
 * Called when connected
 * @callback AutoReconnect~onConnect
 */

/**
 * Called when data come
 * @callback AutoReconnect~onData
 */

/**
 * Called when disconnected
 * @callback AutoReconnect~onDisconnect
 */

/**
 * Called when reconnected
 * @callback AutoReconnect~onReconnect
 */