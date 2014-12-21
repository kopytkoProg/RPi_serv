var dev = require('./Devices');



var f = function ()
{
    dev.D10.Instance.CmdSetPortB(255, function ()
    {
        dev.D10.Instance.CmdSetPortB(0, function (){f()});
    });
};
f();