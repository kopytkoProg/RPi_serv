var exec = require('child_process').exec;


module.exports = function (calback)
{
    exec("ps aux", function (error, stdout, stderr)
    {
        calback('' + stdout);
    });
};
// un used
//,parsedOut: function () {
//    //USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
//    var rex = new RegExp(/^([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.+)$/);
//
//    var splited = _out.split(/\r\n|\n|\r/);
//    var header = splited.shift().replace('%', 'P').replace('%', 'P');
//
//    var headers = rex.exec(header);
//
//    var out = [];
//
//    splited.forEach(function (e) {
//        var match = rex.exec(e);
//
//        if (match != null) {
//            var obj = {};
//
//            for (var i = 1; i < match.length; i++) {
//                obj[headers[i]] = match[i];
//            }
//
//            out.push(obj);
//        }
//    });
//
//    return out;
//}
