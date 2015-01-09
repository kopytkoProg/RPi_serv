myModule.controller('ledController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig)
    {


        var timeoutHelper = new TimeoutHelper();
        var lastStaterSendTime = 0;


        var loadData = function ()
        {
            var time = lastStaterSendTime;
            $http.get('/api/devices/D10/getLedStatus').
                success(function (data, status, headers, config)
                {
                    if (!data.error)
                    {
                        if (time == lastStaterSendTime)
                        {
                            $scope.Leds = data;
                        }
                    }
                    else
                    {
                        $.notify('Error: ' + JSON.stringify(data, null, 4), "error");
                    }

                    timeoutHelper.setTimeout(loadData, AppConfig.devices.Led.Interval);
                }
            ).
                error(function (data, status, headers, config)
                {
                    $.notify('Error: ' + JSON.stringify(data, null, 4), "error");
                    timeoutHelper.setTimeout(loadData, AppConfig.devices.Led.Interval);
                });
        };
        loadData();


        var sendNewLedStatus = function ()
        {
            lastStaterSendTime++;

            var done = false;
            timeoutHelper.setTimeout(function ()
            {
                if (!done)  $scope.InProgress = true;
            }, 500);

            $http.put('/api/devices/D10/setLedStatus', $scope.Leds).
                success(function (data, status, headers, config)
                {
                    $scope.InProgress = false;
                    done = true;
                }).
                error(function (data, status, headers, config)
                {
                    $scope.InProgress = false;
                    $.notify('Error: ' + JSON.stringify(data, null, 4), "error");
                    done = true;
                });
        };
        $scope.sendNewLedStatus = sendNewLedStatus;

        $scope.$on("$destroy", timeoutHelper.clearAll);

    })
;