/**
 * Created by michal on 2014-12-06.
 */


myModule.controller('osNavbarController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig)
    {

        $scope.cpu = '-';
        $scope.mem = '-';
        $scope.disk = '-';
        $scope.diskName = '-';
        $scope.core_temp = '-';

        var cpuDataLoade = function ()
        {

            $http.get('/api/os/now/cpus').
                success(function (data, status, headers, config)
                {
                    var cpus = data.cpus;

                    //console.log('data', data);
                    var cpuPercents = []
                    for (var i = 0; i < cpus.length; i++)
                    {
                        var times = cpus[i].times;
                        var total = times.irq + times.idle + times.user + times.sys + times.nice;
                        cpuPercents[i] = ((total - times.idle) / total) * 100;
                    }
                    var cpuPercentsAvg = cpuPercents.reduce(function (acc, e, i, arr)
                        {
                            return acc + e;
                        }, 0) / cpuPercents.length;

                    $scope.cpu = cpuPercentsAvg.toFixed(1);
                    $scope.core_temp = data.coreTemp.toFixed(1)

                    setTimeout(cpuDataLoade, AppConfig.CpuUsage.RefreshTime);
                }).
                error(function (data, status, headers, config)
                {
                    setTimeout(cpuDataLoade, AppConfig.CpuUsage.RefreshTime);
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

                    setTimeout(osDataLoade, AppConfig.Os.RefreshTime);
                }).
                error(function (data, status, headers, config)
                {
                    setTimeout(osDataLoade, AppConfig.Os.RefreshTime);
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

                    setTimeout(diskDataLoade, AppConfig.Disk.RefreshTime);
                }).
                error(function (data, status, headers, config)
                {
                    setTimeout(diskDataLoade, AppConfig.Disk.RefreshTime);
                });


        };
        diskDataLoade();


    });