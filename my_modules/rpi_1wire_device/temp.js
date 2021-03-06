/**
 * Created by michal on 2014-12-12.
 */
var list = require('./list');
var exec = require('child_process').exec;
var DS18B20 = require('../../config/DS18B20');

/***
 *
 * @param {tempReadyCallback} callback
 */
var GetTemps = function (callback) {
    ///** @type {GetTemps~DS18B20DDescriptionObject[]} */
    var temps = [];
    ///** @type {GetTemps~DS18B20DDescriptionObject[]} */
    var crcErrors = [];

    list(function (l) {

        //l.forEach(function (id) {
        //
        //    /**
        //     * Description of temp sesnor
        //     * @type {DS18B20DDescriptionObject}
        //     */
        //    var descObj = DS18B20.DescriptionFor(id);
        //
        //    temps.push({
        //        id: id,
        //        temp: 0
        //    });
        //
        //
        //});
        //callback(temps);

        var f = function ()
        {   // wait until end all measure
            if (temps.length + crcErrors.length != l.length);
            else callback(temps.sort(function (a, b)
            {
                return a.id.localeCompare(b.id);
            }));
        };


        l.forEach(function (id)
        {
            exec("cat /sys/bus/w1/devices/" + id + "/w1_slave",
                function (error, stdout, stderr)
                {
                    //console.log(id, stdout);
                    var temp = null;
                    var crcCorrect = false;

                    if (error !== null);
                    else
                    {
                        var lines = stdout.trim().split(/\r\n|\n|\r/);

                        var crcRex = new RegExp(/^.*(YES)$/);
                        var tempRex = new RegExp(/^.*t=(-?[0-9]*)$/);

                        crcCorrect = crcRex.test(lines[0]);
                        var match = tempRex.exec(lines[1]);

                        temp = parseFloat(match[1]) / 1000;

                    }
                    /**
                     * Description of temp sesnor
                     * @type {DS18B20DDescriptionObject}
                     */
                    var descObj = DS18B20.DescriptionFor(id);
                    if (crcCorrect)
                    {
                        temps.push({
                            id: id,
                            innerId: descObj.innerId,
                            temp: temp,
                            date: new Date(),
                            crcCorrect: crcCorrect,
                            name: descObj.name
                        });
                    }
                    else
                    {
                        crcErrors.push({
                            id: id,
                            innerId: descObj.innerId,
                            temp: temp,
                            date: new Date(),
                            crcCorrect: crcCorrect,
                            name: descObj.name
                        });
                    }

                    f();
                });


        });


    });
};

module.exports = GetTemps;
//exports.temp = temp;

/**
 * @typedef {Object} GetTemps~DS18B20DDescriptionObject
 * @property {string} id
 * @property {string} innerId
 * @property {string} name
 * @property {number} temp
 * @property {Date} date
 * @property {boolean} crcCorrect
 *
 */

/**
 * This callback is displayed as a global member.
 * @callback tempReadyCallback
 * @param {DS18B20DDescriptionObject[]} temps contains sorted array of temps
 */