/**
 * Created by michal on 2014-12-12.
 */
var list = require('./list');
var exec = require('child_process').exec;
var DS18B20 = require('../../../config/DS18B20');

/***
 *
 * @param {tempReadyCallback} callback
 */
var temp = function (callback)
{

    var temps = [];

    list(function (l)
    {
        l.forEach(function (id)
        {
            exec("cat /sys/bus/w1/devices/" + id + "/w1_slave",
                function (error, stdout, stderr)
                {
                    var temp = 0;

                    if (error !== null);
                    else
                    {
                        var lines = stdout.trim().split(/\r\n|\n|\r/);

                        var crcRex = new RegExp(/^.*(YES)$/);
                        var tempRex = new RegExp(/^.*t=([0-9]*)$/);

                        var crcCorrect = crcRex.test(lines[0])
                        var match = tempRex.exec(lines[1]);

                        temp = parseFloat(match[1]) / 1000;

                    }
                    /***
                     * Description of temp sesnor
                     * @type {DS18B20DDescriptionObject}
                     */
                    var descObj = DS18B20.DescriptionFor(id);

                    temps.push({
                        id: id,
                        innerId: descObj.innerId,
                        temp: temp,
                        date: new Date(),
                        crcCorrect: crcCorrect,
                        name: descObj.name
                    });
                });


        });

        var f = function ()
        {   // wait until end all measure
            if (temps.length != l.length) setTimeout(f, 200);
            else callback(temps.sort(function (a, b)
            {
                return a.id.localeCompare(b.id);
            }));
        }
        f();
    });
}

module.exports = temp;


/**
 * This callback is displayed as a global member.
 * @callback tempReadyCallback
 * @param {Array} temps contains sorted array of temps
 */