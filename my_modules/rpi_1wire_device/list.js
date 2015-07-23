/**
 * Created by michal on 2014-12-12.
 */
var exec = require('child_process').exec;
var list = function (calback) {
    // debug only
    calback([
        '28-0000058f448c',
        '28-0000058f8de4'
    ]);

    //
    //exec('ls /sys/bus/w1/devices -1 | grep "28-00000*"',
    //    function (error, stdout, stderr)
    //    {
    //        if (error !== null) calback([]);
    //        else calback(stdout.trim().split(/\s/));
    //    });

};

module.exports = list;