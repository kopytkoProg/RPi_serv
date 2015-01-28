var dev = require('./Devices');
var SensorScanner = require('./../PeopleSensor/SensorScanner');
var SensorsHistory = require('./../PeopleSensor/SensorsHistory');

//for (var i = 1; i < 1000; i++) dev.D20.CmdSetPortB(i % 3);


dev.D30.CmdHelloWorld(function (r)
{
    console.log(r);
});

dev.D30.CmdGetCounter(function (stat, counter)
{
    if (stat) console.log("counter64: " + counter);
});

SensorScanner.addListener(function (moveSinceLastTime)
{
   // console.log(moveSinceLastTime);
});

SensorsHistory.getHistory(function(h){
    console.log(h);
}, new Date());



////dev.D20.CmdPrint('ABCDefghijklmniop', function(){console.log('Ok')});
//dev.D20.CmdHome(function(){console.log('Ok')});
//dev.D20.CmdPrint('Ok', function(){console.log('Ok')});
//dev.D20.CmdClear(function(){console.log('Ok')});
//dev.D20.CmdGoTo(5,0,function(){console.log('Ok')});
//dev.D20.CmdPrint('OK! ;)', function(){console.log('Ok')});
//
//dev.D20.CmdClear(function (b)
//{
//    console.log('Ok', b)
//});
//
//function msToNextMinute()
//{
//    var now = new Date().getTime();
//    return (1000 * 60) - (now % (1000 * 60));
//}
//
//function f()
//{
//    dev.D20.CmdPrintHour();
//    setTimeout(f, msToNextMinute());
//};
//f();
//setTimeout(f, msToNextMinute());


//var f = function ()
//{
//
//    //var t1 = new Date().getTime();
//
//    dev.D20.CmdSetPortB(1, function ()
//    {
//        //console.log(new Date().getTime() - t1);
//        dev.D20.CmdSetPortB(2, function ()
//        {
//
//            f()
//
//        });
//    });
//
//};
//f();

