var dev = require('./Devices');


dev.D10.CmdSetPortB(1, function ()
{


});


for (var i = 1; i < 100; i++) dev.D10.CmdSetPortB(i % 3);

var f = function ()
{

    //var t1 = new Date().getTime();

    dev.D10.CmdSetPortB(1, function ()
    {
        //console.log(new Date().getTime() - t1);
        dev.D10.CmdSetPortB(2, function ()
        {

            f()

        });
    });

};
f();

