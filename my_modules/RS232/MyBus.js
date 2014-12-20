var serialPort = require("serialport");
var SerialPort = serialPort.SerialPort;


var MSG_ADDRESS = 0;
var MSG_COMMAND = 1;
var MSG_DATA_LENGTH = 2;

var MY_ADDRESS = 1;


var crc = function (data)
{
    return data.reduce(function (acc, e)
    {
        acc += e;
        return acc & 255;
    }, 0);
};

//===============================================================

/**
 * @param {Number} address
 * @param {Number} command
 * @param {Array.<Number>}data
 */
var Msg = function (address, command, data)
{
    this.address = address;
    this.command = command;
    this.data = data;

    this.toArray = function ()
    {
        var rawHeader = [this.address, this.command, this.data.length];
        var rawMsg = rawHeader.concat(data);

        return rawMsg;
    };

    this.get = function ()
    {
        var rawMsg = this.toArray();
        rawMsg.push(crc(rawMsg));
        return rawMsg;
    };

    this.getCrc = function ()
    {
        return crc(this.toArray());
    }
};

//===============================================================

var MyBus = function (onOpen, onRead)
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
        return new Msg(arr[MSG_ADDRESS], arr[MSG_COMMAND], arr.slice(3, arr[MSG_DATA_LENGTH] + 3));
    };


    var timeOut = function ()
    {
        console.log('Timeout');
        myBuffer = [];
    };

    var myBuffer = [];
    var lastTimeout = 0;
    var timeoutTime = 50; //ms
    var port = new SerialPort("COM3", {
        baudrate: 9600,
        parser: function (emitter, buffer)
        {

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
     * @param {Msg} msg
     * @param [unWrite]
     */
    this.write = function (msg, unWrite)
    {
        //console.log(msg.get());
        port.write(msg.get(), unWrite);
    };

};

var p = new MyBus(function ()
{
    console.log('OPEN');
    setInterval(function(){p.write(new Msg(10, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));}, 500)

}, function (data)
{
    console.log(data);
});


module.exports =
{
    MyBus: MyBus,
    Msg: Msg
};




/**
 * @callback RS232OnListReady
 * @param err
 * @param {comName, pnpId, manufacturer} ports
 */