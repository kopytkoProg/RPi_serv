/**
 * Created by michal on 28.07.15.
 */
myModule.controller('espDevicesDiagnosticController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig)
    {

        //console.log('', AppConfig);
        var timeoutHelper = new TimeoutHelper();


        var loadData = function ()
        {
            $http.get('/api/esp_devices/list').
                success(function (data, status, headers, config)
                {
                    $scope.list = data.list;
                    //timeoutHelper.setTimeout(loadData, 5000);
                }).
                error(function (data, status, headers, config)
                {
                    //timeoutHelper.setTimeout(loadData, 5000);
                });
        };
        loadData();
        $scope.$on("$destroy", timeoutHelper.clearAll);

    });