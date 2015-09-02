
myModule.factory('PlotScalingService', function (AppConfig) {
    /**
     *
     * @param  plot
     * @param {jQuery} plot_container
     * @param {{sensor: DS18B20DDescriptionObject, history:{temp: number, date: string}[]}[]} data
     * @param $scope
     */
    var PlotScalingService = function (plot, plot_container, data, $scope) {
        /** @type {number[]} contain all teps from all sensors */
        var all_temps = data.reduce(
            function (acc, e) {
                return acc.concat(
                    e.history.reduce(
                        function (acc, e) {
                            acc.push(parseFloat(e.temp));
                            return acc;
                        },
                        []
                    )
                )
            }, []);

        /* If no temps in history then insert two values, this value will be us to select min and max */
        if (all_temps.length == 0) {
            all_temps.concat([0, 20]);
        }

        var min_y = Math.min.apply(null, all_temps),
            max_y = Math.max.apply(null, all_temps),
            difference = max_y - min_y;

        var onResize = function () {
            if (plot) {
                AppConfig.tempHistory.setHeightByWidth(plot_container);

                var opts = plot.getOptions();

                opts.xaxes[0].tickSize = AppConfig.tempHistory.getHourTickSize(plot_container);
                opts.yaxes[0].tickSize = AppConfig.tempHistory.getTempTickSize(difference);
                plot.resize();
                plot.setupGrid();
                plot.draw();
            }
        };

        new (function () {
            var lastResize = null;
            var rawOnResize = function () {
                if (lastResize != null) clearTimeout(lastResize);
                lastResize = setTimeout(onResize, AppConfig.tempHistory.DelayBeforeAcceptResizing);
            };
            $(window).resize(rawOnResize);
            onResize();

            /* Destroy on resize event handler */
            var destroy = function () {
                $(window).off("resize", null, rawOnResize);
            };

            /* If scope define then register on destroy event handler */
            if ($scope) $scope.$on("$destroy", function (event) {
                destroy();
            });
        })();


    };
    return PlotScalingService;
});