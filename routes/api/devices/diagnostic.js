/**
 * Created by michal on 2015-01-20.
 */
var express = require('express');
var router = express.Router();
var dev = require('./../../../my_modules/RS232/Devices');
var MessageFilter = require('./../../../my_modules/RS232/MessageFilter');

router.get('/', function (req, res) // list of connected sensors
{

    var diagArray = [];
    for (var name in dev)
    {
        var fe = MessageFilter.getByAddress(dev[name].info.Address);
        if (!fe) fe = {address: dev[name].info.Address, lastFail: null, lastSuccess: null, nextProbeInterval: null};

        fe.id = dev[name].info.Id;
        fe.instanceInfo = dev[name].info.InstanceInfo;

        diagArray.push(fe);
    }

    res.end(JSON.stringify({DeviceStatus: diagArray}), 'utf8');
});

router.get('/hello/:address', function (req, res) // list of connected sensors
{
    var findDevice = function (address)
    {
        var result = null;
        for (var name in dev)
            if (!result && dev[name].info.Address == address)  result = dev[name];
        return result;
    };

    /**
     * @type {FirstDevice}
     */
    var selectedDevice = findDevice(req.params.address);
    if (selectedDevice)
    {
        var fe = MessageFilter.getByAddress(parseInt(req.params.address));
        if (fe) fe.nextProbeInterval = 0;
        selectedDevice.CmdHelloWorld(function (succes)
        {
            if (succes) res.end(JSON.stringify({ok: 'Connection successful'}), 'utf8');
            else res.end(JSON.stringify({error: 'Connection fail to ' + req.params.address}), 'utf8');
        });
    }
    else
    {
        res.end(JSON.stringify({error: 'No device found'}), 'utf8');
    }


});


module.exports = router;
