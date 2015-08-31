myModule.controller('actualTempController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig) {

        //console.log('', AppConfig);
        var timeoutHelper = new TimeoutHelper();


        var getAllSensors = function () {
            $http.get('/api/temp_1wire/sensors/descriptions/enabled').
                success(function (data, status, headers, config) {

                    data.forEach(function (d) {
                        d.temp = null;
                        d.crcCorrect = true;
                    });

                    $scope.tempSensorList = data;

                    loadData();
                }).
                error(function (data, status, headers, config) {
                    $.notify('Error: Cant get temp sensor list!', "error");
                });
        };


        var loadData = function () {
            $http.get('/api/temp_1wire/temp').
                success(function (data, status, headers, config) {
                    // $scope.temps = data.temp;
                    //$scope.temps.push({id: '28-0000054d6df0', temp: 25.0, date: new Date(), crcCorrect:true});


                    $scope.tempSensorList.forEach(function (d) {
                        d.temp = null;
                        data.temp.forEach(function (t) {
                            if (d.innerId == t.innerId) {
                                d.temp = t.temp;
                                d.date = t.date;
                                d.crcCorrect = t.crcCorrect;
                            }
                        })
                    });

                    // console.log($scope.tempSensorList);
                    timeoutHelper.setTimeout(loadData, AppConfig.Temp.Interval);
                }).
                error(function (data, status, headers, config) {
                    timeoutHelper.setTimeout(loadData, AppConfig.Temp.Interval);
                });
        };


        $scope.$on("$destroy", timeoutHelper.clearAll);

        getAllSensors();
    });