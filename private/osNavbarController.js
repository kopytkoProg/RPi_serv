/**
 * Created by michal on 2014-12-06.
 */
myModule.controller('osNavbarController', function ($scope, $http)
{

    $scope.cpu = '-';
    $scope.mem = '-';
    $scope.disk = '-';
    $scope.diskName = '-';


    var cpuDataLoade = function ()
    {

        $http.get('/api/os/now/cpus').
            success(function (data, status, headers, config)
            {
                console.log('data', data);
                var cpuPercents = []
                for (var i = 0; i < data.length; i++)
                {
                    var times = data[i].times;
                    var total = times.irq + times.idle + times.user + times.sys + times.nice;
                    cpuPercents[i] = ((total - times.idle) / total) * 100;
                }
                var cpuPercentsAvg = cpuPercents.reduce(function (acc, e, i, arr)
                    {
                        return acc + e;
                    }, 0) / cpuPercents.length;

                $scope.cpu = cpuPercentsAvg.toFixed(1);

                setTimeout(cpuDataLoade, 5000);
            }).
            error(function (data, status, headers, config)
            {
                setTimeout(cpuDataLoade, 1000);
            });


    };
    cpuDataLoade();

    var osDataLoade = function ()
    {

        $http.get('/api/os').
            success(function (data, status, headers, config)
            {

                var memPercentage = (data.totalmem - data.freemem) / data.totalmem * 100;
                $scope.mem = memPercentage.toFixed(1);

                setTimeout(osDataLoade, 5000);
            }).
            error(function (data, status, headers, config)
            {
                setTimeout(osDataLoade, 1000);
            });


    };
    osDataLoade()

    var diskDataLoade = function ()
    {

        $http.get('/api/os/disk').
            success(function (data, status, headers, config)
            {

                var memPercentage = (data.total - data.free ) / data.total * 100;
                $scope.disk = memPercentage.toFixed(1);
                $scope.diskName = data.disk;

                setTimeout(diskDataLoade, 1000 * 60 * 60);
            }).
            error(function (data, status, headers, config)
            {
                setTimeout(diskDataLoade, 1000 * 60 * 60);
            });


    };
    diskDataLoade();


});