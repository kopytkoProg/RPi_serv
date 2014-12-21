var serialPort = require("serialport");
var MsgClass = require("./MsgClass");
var SerialPort = serialPort.SerialPort;
var MyBusConfig = require('./../../config/MyBusConfig');

var timeoutTime = 100; //ms

var MSG_ADDRESS = 0;
var MSG_COMMAND = 1;
var MSG_DATA_LENGTH = 2;

var MY_ADDRESS = MyBusConfig.MY_ADDRESS;



//===============================================================

//===============================================================

/**
 * @class MyBusClass
 * @param onOpen
 * @param onRead
 * @constructor
 */
var MyBusClass = function (onOpen, onRead)
{
    /**
     * @param {RS232OnListReady} callback
     */
    this.listOfAvailable = function (callback)
    {
        serialPort.list(function (err, ports)
        {
            if (err) throw err;
            callback(ports);

        });
    };

    var parseMsg = function (arr)
    {
        var arrayCp = arr.slice(0, arr.length);
        return new MsgClass(arr[MSG_ADDRESS], arr[MSG_COMMAND], arr.slice(3, arr[MSG_DATA_LENGTH] + 3));
    };


    var timeOut = function ()
    {
        console.log('Timeout');
        myBuffer = [];
    };

    var myBuffer = [];
    var lastTimeout = 0;

    var port = new SerialPort("COM3", {
        baudrate: 9600,
        parser: function (emitter, buffer)
        {

            //console.log('RAW', buffer);
            for (var i = 0; i < buffer.length; i++)
                myBuffer.push(buffer[i]);

            if (myBuffer.length < 3)
            {
                clearTimeout(lastTimeout);
                lastTimeout = setTimeout(timeOut, timeoutTime);
            }
            else if (myBuffer[MSG_DATA_LENGTH] > myBuffer.length - 4)
            {

                clearTimeout(lastTimeout);
                lastTimeout = setTimeout(timeOut, timeoutTime);
            }
            else
            {
                clearTimeout(lastTimeout);

                var msg = parseMsg(myBuffer);
                if (msg.getCrc() == myBuffer[myBuffer[MSG_DATA_LENGTH] + 3] && msg.address == MY_ADDRESS)
                {
                    emitter.emit('data', msg);
                }else{
                    console.log('CRC Error');
                }

                myBuffer = [];
            }
        }
    });

    port.on("open", function (error)
    {
        if (error) throw error;
        onOpen();
        port.on('data', onRead);
    });

    /**
     * @param {MsgClass} msg
     * @param [onWrite]
     */
    this.write = function (msg, onWrite)
    {
        //console.log(msg);
        //console.log(msg.get());
        port.write(msg.get(), onWrite);
    };

};

//var p = new MyBusClass(function ()
//{
//    console.log('OPEN');
//    setInterval(function(){p.write(new MsgClass(10, 3));}, 500)
//
//}, function (data)
//{
//    console.log(data);
//});

/**
 *
 * @type {{MyBusClass: Function, MsgClass: Function}}
 */
module.exports =
{
    MyBusClass: MyBusClass
};


/**
 * @callback RS232OnListReady
 * @param err
 * @param {comName, pnpId, manufacturer} ports
 */