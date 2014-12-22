var dev = require('./Devices');



dev.D10.Instance.CmdSetPortB(1, function ()
{



});


var f = function ()
{

    //var t1 = new Date().getTime();
    dev.D10.Instance.CmdSetPortB(1, function ()
    {
        //console.log(new Date().getTime() - t1);
        dev.D10.Instance.CmdSetPortB(2, function ()
        {

            f()

        });
    });

};
f();

