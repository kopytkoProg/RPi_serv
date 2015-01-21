/**
 * Created by michal on 2014-12-23.
 */
/**
 * Created by michal on 2014-12-12.
 */
var express = require('express');
var router = express.Router();
var dev = require('./../../../my_modules/RS232/Devices');

var firstDevice = dev.D10;

(function ()
{
    var led0Mask = 1;
    var led1Mask = 2;

    var findDevice = function (devId)
    {
        var result = null;
        for (var name in dev)
            if (!result && dev[name].info.Id == devId)  result = dev[name];
        return result;
    };

    /**
     *
     * @param devId
     * @param [devClass]
     * @returns {{do: function, else:function}}
     */
    var myRouter = function (devId, devClass)
    {
        var dev = findDevice(devId);

        var result = {};
        result.dev = dev;
        result.condition = dev && (!devClass || dev.info.InstanceOf == devClass);
        result.do = function (callback)
        {
            if (this.condition) callback(dev);
            return this;
        };
        result.else = function (callback)
        {
            if (!this.condition) callback();
            return this;
        };

        return result;
    };
    //==================================================================================================================

    router.use(function (req, res, next)
    {
        res.writeHead(200, {'Content-Type': 'text/json'});
        next();
    });

    var incorectDeviceResponse = function (req, res)
    {
        res.end(JSON.stringify({error: 'Incorrect device'}), 'utf8');
    };
    //==================================================================================================================

    router.get('/:devId/getLedStatus', function (req, res) // list of connected sensors
    {

        myRouter(req.params.devId, 'LcdTimeDevice').do(/** @param {FirstDevice} firstDevice*/ function (firstDevice)
        {
            firstDevice.CmdGetPortB(function (result, portStatus)
            {
                if (result)
                {
                    var obj = {
                        LED0: Boolean(led0Mask & portStatus),
                        LED1: Boolean(led1Mask & portStatus)
                    };

                    res.end(JSON.stringify(obj), 'utf8');
                }
                else
                {
                    res.end(JSON.stringify({error: 'Communication error'}), 'utf8');
                }

            });
        }).else(function ()
        {
            incorectDeviceResponse(req, res);
        });

    });

    //==================================================================================================================

    router.put('/:devId/setLedStatus', function (req, res) // list of connected sensors
    {

        var newStatus = (req.body.LED0 ? led0Mask : 0) + (req.body.LED1 ? led1Mask : 0);
        myRouter(req.params.devId, 'LcdTimeDevice').do(/** @param {FirstDevice} firstDevice*/ function (firstDevice)
        {
            firstDevice.CmdSetPortB(newStatus, function (result)
            {
                if (result)
                {
                    res.end(JSON.stringify({success: 'success'}), 'utf8');
                }
                else
                {
                    res.end(JSON.stringify({error: 'Communication error'}), 'utf8');
                }
            });
        }).else(function ()
        {
            incorectDeviceResponse(req, res);
        });

    });


})
();

module.exports = router;
