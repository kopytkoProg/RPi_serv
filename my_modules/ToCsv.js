/**
 * Created by michal on 2014-12-13.
 */
var historyFsStorage = require('./historyFsStorage');
var fs = require('fs');

var ToCsv = function ()
{

    var from = process.argv[2];
    var to = process.argv[3];

    var h = new historyFsStorage(from);
    var ws = fs.createWriteStream(to);

    h.redLinByLine(function (l)
    {

        if (l != null)
        {
            var a = JSON.parse(l);
            a.forEach(function (o)
            {
                //1900-01-01  00:00:00
                var date = new Date(o.date);
                var dataExcel = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
                var line = o.innerId + ';'+  dataExcel + ';' + ((o.temp + '').replace('.', ','))  + ';';
                //fs.appendFile(to, line);
                ws.write(line);
            });
            ws.write('\n');
        }
        else
        {
            //ws.close();
        }
    });


};
ToCsv();