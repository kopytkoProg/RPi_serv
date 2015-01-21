/**
 * Created by michal on 2015-01-20.
 */
myModule.controller('deviceDiagnosticController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig)
    {
        $scope.filterList = [];
        var timeoutHelper = new TimeoutHelper();
        var lasttimout = 0;

        var loadData = function ()
        {
            $http.get('/api/devices/diagnostic').success(
                function (data, status, headers, config)
                {

                    data.DeviceStatus.forEach(function (e)
                    {
                        e.lastFail = e.lastFail ? e.lastFail : 0;
                        e.lastSuccess = e.lastSuccess ? e.lastSuccess : 0;
                        e.nextProbeInterval = e.nextProbeInterval ? e.nextProbeInterval : 0;
                    });

                    $scope.filterList = data.DeviceStatus;

                    clearTimeout(lasttimout);
                    lasttimout = timeoutHelper.setTimeout(loadData, AppConfig.devicesDiagnostic.Interval);
                }
            ).error(function (data, status, headers, config)
                {
                    clearTimeout(lasttimout);
                    lasttimout = timeoutHelper.setTimeout(loadData, AppConfig.devicesDiagnostic.Interval);
                }
            );
        };
        loadData();


        // Test ========================
        $scope.test = function (address)
        {
            $http.get('/api/devices/diagnostic/hello/' + address).success(
                function (data, status, headers, config)
                {
                    loadData();

                    if (data.error) $.notify('Error: ' + data.error, "error");


                }
            );
        };


        $scope.$on("$destroy", timeoutHelper.clearAll);
    });