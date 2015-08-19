/**
 * Created by michal on 28.07.15.
 */
myModule.controller('espDevicesDiagnosticController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig) {

        //console.log('', AppConfig);
        var timeoutHelper = new TimeoutHelper();


        $scope.scanWifi = function (esp) {
            $('#scan').prop('disabled', true);
            setTimeout(function () {
                $('#scan').prop('disabled', false);
                $scope.getWifi(esp);
            }, 5 * 1000);
            $http.get('/api/esp_devices/scan_wifi/' + esp.id);

        };

        $scope.getWifi = function (esp) {
            $http.get('/api/esp_devices/wifi/' + esp.id).
                success(function (data, status, headers, config) {
                    esp.wifi = JSON.stringify(data.wifi, null, 4);
                })
        };

        var loadData = function () {
            $http.get('/api/esp_devices/list').
                success(function (data, status, headers, config) {
                    $scope.list = data.list;
                    //timeoutHelper.setTimeout(loadData, 5000);
                }).
                error(function (data, status, headers, config) {
                    //timeoutHelper.setTimeout(loadData, 5000);
                });
        };
        loadData();


        $scope.$on("$destroy", timeoutHelper.clearAll);

    });