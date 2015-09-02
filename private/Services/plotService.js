/**
 * Created by michal on 02.09.15.
 */
/**
 * This Service is response for plot
 * */
myModule.factory('PlotService', function (AppConfig /*, PlotScalingService, PlotTooltipService*/) {
    var PlotService = {
        /**
         * @param {jQuery} plot_container
         * @param {{sensor: DS18B20DDescriptionObject, history:{temp: number, date: string}[]}[]} data
         * @param $scope
         */
        draw_plot: function (plot_container, data, $scope) {
            // console.log('Ok!', plot_container, data);

            var dataForPlot = [];

            /** This part is response for prepare data series*/
            data.forEach(function (sensor_history) {
                dataForPlot.push(
                    {
                        color: sensor_history.sensor.color ? sensor_history.sensor.color : null,
                        label: sensor_history.sensor.name,
                        points: {show: true},
                        lines: {show: true},
                        data: sensor_history.history.reduce(function (acc, e) {
                            var d = new Date(e.date);
                            acc.push(
                                [
                                    (d.getTime() + (-d.getTimezoneOffset() * 60 * 1000)) % (1000 * 60 * 60 * 24),
                                    e.temp
                                ]);
                            return acc;
                        }, [])

                    });
            });


            var xMin = new Date(0);
            var xMax = new Date(xMin.getTime());
            xMax.setDate(xMax.getDate() + 1);

            /** It create flot obj witch specified settings */
            var plot = $.plot(plot_container, dataForPlot, {
                xaxis: {
                    mode: "time",
                    tickSize: AppConfig.tempHistory.getHourTickSize(plot_container),
                    min: xMin.getTime(),
                    max: xMax.getTime()
                },
                grid: {
                    hoverable: true,
                    borderWidth: {top: 0.5, right: 0.5, bottom: 0.5, left: 0.5}
                },
                yaxis: {
                    tickSize: 1
                },
                legend: {
                    labelFormatter: function (label, series) {
                        return '<span style="cursor:pointer;" class="myLegend">' + label + '</span>';
                    }
                }
            });

            ///** Part response for display tooltip on hover data point */
            //PlotTooltipService(plot_container);
            //
            ///** Part response for scaling plots */
            //PlotScalingService(plot, plot_container, data, $scope);

            return plot;
        }
    };

    return PlotService;
});
