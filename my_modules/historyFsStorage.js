/**
 * Created by michal on 2014-12-13.
 */
var fs = require('fs'),
    readline = require('readline');


/***
 * @class
 * @param {string} path path to file
 */
var historyFsStorage = function (path)
{

    var p = path;
    //console.log(p);
    /***
     * Call callback on each line, when EOF then line contains null.
     * @param {lineCallback} callback
     */
    this.redLinByLine = function (callback)
    {
        fs.exists(p, function (exists)
        {
            if (exists)
            {
                var stream = fs.createReadStream(p, {flags: 'r'});
                var rd = readline.createInterface({
                    input: stream,
                    output: process.stdout,
                    terminal: false
                });

                rd.on('line', function (line)
                {
                    callback(line);
                });

                rd.on('close', function ()
                {
                    callback(null)
                });
            }
            else
            { // no exists
                //throw 'file not exists! : ' + p;
                callback(null)
            }
        });
    }

    /**
     * @param {string} line
     */
    this.appendLine = function (line)
    {
        fs.appendFile(p, line + '\n', function (err)
        {
            if (err) throw err;
        });
    }

};


//var h = new historyFsStorage('./xxx/tempHistoryStorage.txt');
//
//setInterval(function ()
//{
//    h.appendLine(new Date() + '\n');
//    h.redLinByLine(function (line)
//    {
//        console.log(line);
//    });
//   // h.appendLine(new Date() + '\n');
//
//}, 1000);


module.exports = historyFsStorage;

/**
 * This callback is displayed as a global member.
 * @callback lineCallback
 * @param {string} line contains string or null when EOF. If file not exist then line = null
 */
