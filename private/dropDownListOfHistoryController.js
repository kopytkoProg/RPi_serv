/**
 * Created by michal on 01.09.15.
 */
myModule.controller('dropDownListOfHistoryController',
    /**
     *
     * @param $scope
     * @param $http
     * @param $q
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, $q, AppConfig) {

        /** @type {DS18B20DDescriptionObject[]} contain list of all sensors */
        $scope.list_of_history = [];

        function call_at_start_each_next_day(call) {
            var timeoutHelper = new TimeoutHelper();
            timeoutHelper.setTimeout(function () {
                call();
                call_at_start_each_next_day(call);
            }, AppConfig.callOrVal(AppConfig.tempHistory.ListOfHistoriesRefreshInterval));

            $scope.$on("$destroy", function (event) {
                timeoutHelper.clearAll();
            });
        }


        var get_list_of_history = function () {
            return $http.get('/api/temp_1wire/history/list/').then(function (response) { // Success

                /*  Parse date */
                list = response.data.reduce(function (acc, e) {

                    e.rawDate = e.date;
                    /** Parsed date */
                    e.date = new Date(e.date);
                    /** It is displayed value in list*/
                    e.name = e.date.toDateString();
                    acc.push(e);
                    return acc;
                }, []);

                /*  Order by date */
                var list = list.sort(function (a, b) {
                    return b.date.getTime() - a.date.getTime();
                });

                return list;
            })
        };


        get_list_of_history().then(function (list) { // Success

            $scope.list_of_history = list;

        }, function (response) { // Fail

        }).then(function () {

            /* Select first date */
            $scope.selected_history = $scope.list_of_history[0];
            $scope.call_me_when_list_ready($scope.selected_history);

        }).then(function () {

            call_at_start_each_next_day(function () {
                get_list_of_history().then(function (list) {

                    $scope.list_of_history = list;
                    var changed = true;
                    $scope.selected_history = list.reduce(function (acc, e) {
                        if ($scope.selected_history && $scope.selected_history.date.getTime() == e.date.getTime()) {
                            changed = false;
                            return e;
                        }
                        return acc;
                    }, list[0]);

                    if (changed) {
                        $scope.call_me_when_list_ready($scope.selected_history);
                    }
                });
            });

        });


    }
);