/**
 * Created by michal on 2015-01-27.
 */


myModule.controller('moveSensorsHistoryController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, AppConfig)
    {


        var xMin = new Date(0);
        var xMax = new Date(xMin.getTime());
        xMax.setDate(xMax.getDate() + 1);
        var plotsArea = $('#plots');
        var firstLoad = true;

        var timeoutHelper = new TimeoutHelper();
        $scope.listsOfHistories = [];
        var plots = [];
        //$scope.selectedHistory = {date: new Date()}


        function getListOHistories()
        {
            return $http.get('/api/sensors/moveSensors/history/list').
                success(function (data, status, headers, config)
                {
                    //console.log(data);
                    var listsOfHistories = data.reduce(function (acc, e)
                    {

                        var date = new Date(e.date);
                        acc.push({
                            date: date,
                            fileName: e.fileName,
                            text: date.getDate() + ' ' + AppConfig.global.monthsName[date.getMonth()] + ' ' + date.getFullYear()
                        });
                        return acc;
                    }, []);
                    $scope.listsOfHistories = listsOfHistories;

                    $scope.selectedHistory = $scope.listsOfHistories.reduce(function (acc, e)
                    {
                        if ($scope.selectedHistory && $scope.selectedHistory.date.getTime() == e.date.getTime())
                        {
                            return e;
                        }
                        return acc;
                    }, $scope.listsOfHistories[0]);

                    if (firstLoad) everyTimesPanBetweenMeasurement();
                    firstLoad = false;
                });
        }

        function prepareDataAndDrawPlots(data)
        {
            plotsArea.children().remove();
            for (var i in data) plotsArea.append('<h3>' + (data[i].info || 'Unknown') + '</h3><div id="plot_' + i + '" style="width: 100%; height: 70px;"></div>');

            function translate(x)
            {
                switch (x)
                {
                    case true:
                        return 1;
                    case false:
                        return 0;
                    case null:
                        return null;
                    default:
                        throw new Error('Implementation error!');
                }
            }
            plots = [];
            var timezone = new Date().getTimezoneOffset() * 60 * 1000;
            for (var i in data)
            {
                var dataForPlot = [];

                data[i].history.forEach(function (e)
                {
                    var d = new Date(e.date);
                    //d.setFullYear(1970, 0, 1);

                    dataForPlot.push([
                        (d.getTime() + (-d.getTimezoneOffset() * 60 * 1000)) % (1000 * 60 * 60 * 24),
                        //e.moveSinceLastTime ? 1 : 0
                        translate(e.moveSinceLastTime)
                    ]);
                });

                drawPlot('plot_' + i, [{
                    data: dataForPlot,
                    points: {show: true, radius: 2},
                    lines: {show: true}
                }]);
            }
        }


        var getData = function ()
        {
            return $http.get('/api/sensors/moveSensors/historyFor/' + $scope.selectedHistory.date).success(
                function (data, status, headers, config)
                {
                    prepareDataAndDrawPlots(data);
                }
            );
        };
        $scope.getData = getData;


        $("<div id='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            border: "1px solid #fdd",
            padding: "5px",
            "background-color": "#fee",
            opacity: 0.90,
            "border-radius": "10px"
        }).appendTo("#viewContainer");


        function drawPlot(plotId, data)
        {


            plots.push($.plot('#' + plotId, data, {
                xaxis: {
                    mode: "time",
                    tickSize: AppConfig.global.plot.getHourTickSize("#plots"),//[2, 'hour']
                    min: xMin.getTime(),
                    max: xMax.getTime()
                },
                yaxis: {
                    ticks: [[0, "N"], [1, "Y"]],
                    min: -0.2,
                    max: 1.2,
                    tickLength: 0
                },
                grid: {
                    hoverable: true
                },
                legend: {
                    labelFormatter: function (label, series)
                    {
                        return '<span style="cursor:pointer;" class="myLegend" series="' + series.idx + '">' + label + '</span>';
                    }
                }
            }));

            $('#' + plotId).bind("plothover", function (event, pos, item)
            {

                if (item)
                {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    var d = new Date(item.datapoint[0]);
                    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

                    var h = d.getHours(),
                        m = d.getMinutes();


                    var stringDate = h + ":" + (m < 10 ? '0' : '') + m;


                    $("#tooltip").html(stringDate)
                        .css({top: item.pageY + 20, left: item.pageX + 20})
                        .show();
                }
                else
                {
                    $("#tooltip").hide();
                }

            });
        }


        var onResizeController = new (function ()
        {

            var onResize = function ()
            {
                plots.forEach(function (plot)
                {
                    var opts = plot.getOptions();

                    opts.xaxes[0].tickSize = AppConfig.global.plot.getHourTickSize(plot.getPlaceholder());

                    plot.resize();
                    plot.setupGrid();
                    plot.draw();
                });
            };


            var lastResize = null;
            var rawOnResize = function ()
            {
                if (lastResize != null) clearTimeout(lastResize);
                lastResize = timeoutHelper.setTimeout(onResize, AppConfig.global.plot.DelayBeforeAcceptResizing);
            };
            $(window).resize(rawOnResize);

            this.destroy = function ()
            {
                $(window).off("resize", null, rawOnResize);
            };
        })();


        $scope.$on("$destroy", function (event)
        {
            onResizeController.destroy();
            timeoutHelper.clearAll();
        });


        function everyTimesPanBetweenMeasurement()
        {
            getData().success(
                function (data, status, headers, config)
                {
                    timeoutHelper.setTimeout(everyTimesPanBetweenMeasurement, AppConfig.sensors.Interval + 250);
                }
            ).error(
                function (data, status, headers, config)
                {
                    timeoutHelper.setTimeout(everyTimesPanBetweenMeasurement, AppConfig.sensors.Interval + 250);
                }
            );
        }

        function everyNewDay()
        {
            getListOHistories().success(
                function (data, status, headers, config)
                {
                    timeoutHelper.setTimeout(everyNewDay, 1000 * 60 * 60 * 24 + 250);
                }
            ).error(
                function (data, status, headers, config)
                {
                    timeoutHelper.setTimeout(everyNewDay, 1000 * 60 * 60 * 24 + 250);
                }
            );
        }

        everyNewDay();

    });