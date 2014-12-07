/**
 * Created by michal on 2014-12-06.
 */
myModule.controller('myController', function ($scope, $http)
{
    var parse = function (raw)
    {
        //USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
        var rex = new RegExp(/^([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.+)$/);

        var splited = raw.split(/\r\n|\n|\r/);
        var header = splited.shift().replace('%', 'P').replace('%', 'P');

        var headers = rex.exec(header);

        var out = [];

        splited.forEach(function (e)
        {
            var match = rex.exec(e);

            if (match != null)
            {
                var obj = {};

                for (var i = 1; i < match.length; i++)
                {
                    obj[headers[i]] = match[i];
                }

                out.push(obj);
            }
        });

        return out;
    }

    var loadData = function ()
    {

        $http.get('/api/ps').
            success(function (data, status, headers, config)
            {

                data.parsed = parse(data.raw);

                var sum = {
                    PCPU: 0,
                    PMEM: 0
                };
                data.parsed.forEach(function (e)
                {
                    sum.PCPU += parseFloat(e.PCPU);
                    sum.PMEM += parseFloat(e.PMEM);
                });
                $scope.ps = data.parsed;
                $scope.psSum = sum;
            }).
            error(function (data, status, headers, config)
            {
            });

    };
    loadData();

    setInterval(loadData, 5000);

});