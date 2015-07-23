myModule.controller('actualTempController',
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
            $http.get('/api/temp_1wire/temp').
                success(function (data, status, headers, config)
                {
                    $scope.temps = data.temp;
                    //$scope.temps.push({id: '28-0000054d6df0', temp: 25.0, date: new Date(), crcCorrect:true});
                    timeoutHelper.setTimeout(loadData, AppConfig.Temp.Interval);
                }).
                error(function (data, status, headers, config)
                {
                    timeoutHelper.setTimeout(loadData, AppConfig.Temp.Interval);
                });
        };
        loadData();
        $scope.$on("$destroy", timeoutHelper.clearAll);

    });