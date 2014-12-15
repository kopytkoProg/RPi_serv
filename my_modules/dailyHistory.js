var historyFsStorage = require('./historyFsStorage');
var fs = require('fs');
var fileExtension = '.txt';

/***
 * @class
 * @param {string} dir path to directory
 */
var dailyHistory = function (dir)
{
    var date = new Date();
    //date.setDate(date.getDate() - 1);
    var dir = dir.charAt(dir.length - 1) == '/' ? dir : dir + '/';
    var day =
    {
        isTheSame: function (now)
        {
            return date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
        },

        toFileName: function (date)
        {
            return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + fileExtension;
        },

        toDate: function (name)
        {
            var fileName = name.split('.')[0];
            fileName = fileName.split('-');

            var d = new Date(parseInt(fileName[2]), parseInt(fileName[1]) - 1, parseInt(fileName[0]));

            return d;
        },

        prepareDate: function (date)
        {
            date.setHours(0, 0, 0, 0);
            return date;
        },

        next: function (date)
        {
            date.setDate(date.getDate() + 1);
            return date;
        }


    }
    var util = day;

    // ===============================================================

    var currentFile = util.toFileName(date);
    var h = new historyFsStorage(dir + '' + currentFile);


    var checkDate = function ()
    {
        var now = new Date();
        if (!util.isTheSame(now))
        {
            console.log('change');
            date = now;
            currentFile = util.toFileName(date);
            h = new historyFsStorage(dir + '' + currentFile);
        }
    }

    /**
     * @param {string} line
     */
    this.addLine = function (line)
    {
        checkDate();
        h.appendLine(line);
    };

    /***
     *
     * @param {lineCallback} callback called line by line
     * @param {Date} [date]
     */
    this.readFromDate = function (callback, date)
    {
        date = date || new Date();

        var path = dir + util.toFileName(date);
        var h = new historyFsStorage(path);
        h.redLinByLine(callback);
    };


    /***
     *
     * @param {Date} A
     * @param {Date} B
     * @param {lineCallback} callback
     */
    this.readRangeDate = function (A, B, callback)
    {
        util.prepareDate(A);
        util.prepareDate(B);

        if (A.getTime() > B.getTime())
        {
            var x = A;
            A = B;
            B = x;
        }

        function f(i, B)
        {
            if (i.getTime() <= B.getTime())
            {
                var path = dir + util.toFileName(i);
                var h = new historyFsStorage(path);
                h.redLinByLine(function (l)
                {
                    if (l == null) f(util.next(i), B);
                    else callback(l);
                });
            }
            else
            {
                callback(null);
            }
        }

        f(A, B);
    };

    /**
     *
     * @returns {Array.<NameAndData>}
     */
    this.listOfSavedHistory = function ()
    {
        var files = fs.readdirSync(dir).filter(function (e)
        {
            return e.indexOf(fileExtension, e.length - fileExtension.length) !== -1;
        });
        return files.reduce(function (acc, e)
        {
            acc.push({fileName: e, date: util.toDate(e)});
            return acc;
        }, new Array()).sort(function (a, b)
        {
            return b.date - a.date;
        });
    }
};


module.exports = dailyHistory;

/**
 * @typedef {object} NameAndData
 * @property  {string} fileName
 * @property  {Date} date
 * */
