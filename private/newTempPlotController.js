myModule.controller('newTempPlotController',
    /**
     *
     * @param $scope
     * @param $http
     * @param $q
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, $q, AppConfig, PlotService, PlotScalingService, PlotTooltipService) {


        /** Should be cal by dropDownListOfHistoryController when list is ready */
        var sensors_descriptions = [];


        /** Contains list of groups */
        $scope.groups = [];

        /** Place where will be plot */
        var plot_container = $('#plot');


        var selected_history = null;


        var draw_group = function () {
            console.error('Not drawn because something is not ready!')
        };


        /* ==================== Create interval for refresh data ===================  */
        (function () {

            var timeoutHelper = new TimeoutHelper();

            timeoutHelper.setInterval(function () {
                if (selected_history) $scope.called_on_change_date(selected_history)
            }, AppConfig.tempHistory.Interval);

            $scope.$on("$destroy", function (event) {
                timeoutHelper.clearAll();
            });

        })();


        /* Part response for get temperature sensors descriptions */
        var defer_prepare_temp_sensors_description = $http.get('/api/temp_1wire/sensors/descriptions').then(function (response) {
            sensors_descriptions = response.data;
        });

        /* Get groups of sensors */
        var defer_prepare_temp_sensors_groups = $http.get('/api/temp_1wire/sensors/groups').then(function (response) {
            $scope.groups = response.data;
            $scope.selected_group = $scope.groups[0];
        });


        $scope.call_me_when_list_ready = function (selected) {
            $scope.called_on_change_date(selected);
        };

        $scope.called_on_change_date = function (selected) {

            selected_history = selected;

            /** Contains list of histories */
            var history = {};

            var promise_of_return_history = $http.get('/api/temp_1wire/history/date/' + selected.rawDate).then(function (response) {
                history = response.data.history;
            });

            /** When the history is selected and data for groups are prepared then draw plots */
            $q.all([promise_of_return_history, defer_prepare_temp_sensors_description, defer_prepare_temp_sensors_groups]).then(function () {

                /**
                 * @param {DS18B20DGroups} group Selected group to display
                 */
                draw_group = function (group) {
                    /** Sensors histories from thr group*/
                    var sensors_history = [];

                    sensors_descriptions.forEach(function (sensor) {

                        if (sensor.groups.indexOf(group.id) != -1 && history[sensor.innerId]) sensors_history.push({
                            sensor: sensor,
                            history: history[sensor.innerId]
                        });
                    });


                    /** Draw plot */
                    var plot = PlotService.draw_plot(plot_container, sensors_history, $scope);

                    /** Part response for display tooltip on hover data point */
                    PlotTooltipService(plot_container);

                    /** Part response for scaling plots */
                    PlotScalingService(plot, plot_container, sensors_history, $scope);
                };

                draw_group($scope.selected_group);

            });
        };

        $scope.change_group_to = function (selected_group) {
            $scope.selected_group = selected_group;
            draw_group($scope.selected_group);
        };
    }
);


