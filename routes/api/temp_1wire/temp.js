/**
 * Created by michal on 2014-12-12.
 */
var list = require('./list');
var exec = require('child_process').exec;
var DS18B20 = require('../../../config/DS18B20');

var temp = function (calback)
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

                    temps.push({
                        id: id,
                        temp: temp,
                        date: new Date(),
                        crcCorrect: crcCorrect,
                        name: DS18B20.DescriptionFor(id).name
                    });
                });


        });

        var f = function ()
        {   // wait until end all measure
            if (temps.length != l.length) setTimeout(f, 200);
            else calback(temps.sort(function (a, b)
            {
                return a.id.localeCompare(b.id);
            }));
        }
        f();
    });
}

module.exports = temp;