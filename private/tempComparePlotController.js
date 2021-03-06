/**
 * Created by michal on 2014-12-15.
 */

///history/date/:date

myModule.controller('tempComparePlotController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, $q, AppConfig)
    {
        $scope.SelectedA = null;
        $scope.SelectedB = null;

        var timeoutHelper = new TimeoutHelper();

        var SelectHistoryController = function (selectedScopeVariable, listScopeVariable)
        {
            this.insertHistoriesList = function (listsOfHistories)
            {
                $scope[listScopeVariable] = listsOfHistories;
                $scope[selectedScopeVariable] = listsOfHistories.reduce(function (acc, e)
                {
                    if ($scope[selectedScopeVariable] && $scope[selectedScopeVariable].date.getTime() == e.date.getTime())
                    {
                        return e;
                    }
                    return acc;
                }, listsOfHistories[0]);
            };
        };

        var selects = {
            A: new SelectHistoryController('SelectedA', 'ListA'),
            B: new SelectHistoryController('SelectedB', 'ListB')
        };


        var loadListOfHistories = function (callWhenDataLoaded)
        {
            $http.get('api/temp_1wire/history/list').
                success(function (data, status, headers, config)
                {
                    var listsOfHistories = data.reduce(function (acc, e)
                    {
                        var monthsName = [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December"
                        ];
                        var date = new Date(e.date);
                        acc.push({
                            date: date,
                            fileName: e.fileName,
                            text: date.getDate() + ' ' + monthsName[date.getMonth()] + ' ' + date.getFullYear()
                        });
                        return acc;
                    }, []);
                    callWhenDataLoaded(listsOfHistories);
                });
            timeoutHelper.setTimeout(loadListOfHistories, AppConfig.callOrVal(AppConfig.tempHistory.ListOfHistoriesRefreshInterval));
        };

        var firstTime = true;
        loadListOfHistories(function (listsOfHistories)
        {
            for (var i in selects)
            {
                selects[i].insertHistoriesList(listsOfHistories);
            }
            if (firstTime) loadData();
            firstTime = false;
        });

        var lastLoadedDataForPlot = null;
        var loadData = function ()
        {

            if (!$scope.SelectedA || !$scope.SelectedB) return;

            var getDataADefer = $q.defer();
            var getDataBDefer = $q.defer();
            var getDescriptionsDefer = $q.defer();
            //var selectedDateA = $scope.SelectedA.date;
            //var selectedDateB = $scope.SelectedB.date;

            $http.get('/api/temp_1wire/history/date/' + $scope.SelectedA.date).
                success(function (data, status, headers, config)
                {
                    getDataADefer.resolve(data);
                }).
                error(function (data, status, headers, config)
                {
                    getDataADefer.reject(data);
                });

            if ($scope.SelectedA.fileName != $scope.SelectedB.fileName)
                $http.get('/api/temp_1wire/history/date/' + $scope.SelectedB.date).
                    success(function (data, status, headers, config)
                    {
                        getDataBDefer.resolve(data);
                    }).
                    error(function (data, status, headers, config)
                    {
                        getDataBDefer.reject(data);
                    });
            else getDataBDefer.resolve(null);

            $http.get('api/temp_1wire/sensors/descriptions').
                success(function (data, status, headers, config)
                {
                    getDescriptionsDefer.resolve(data);
                }).
                error(function (data, status, headers, config)
                {
                    getDescriptionsDefer.reject(data);
                });


            $q.all([getDescriptionsDefer.promise, getDataADefer.promise, getDataBDefer.promise]).then(function (d)
            {
                /**
                 * @type {DataAndDescription}
                 */
                var dataForPlot = {histories: []};
                dataForPlot.descriptions = d[0];

                dataForPlot.histories.push({history: d[1].history, labelPrefix: 'A'});
                if (d[2]) dataForPlot.histories.push({history: d[2].history, labelPrefix: 'B'});

                drawPlotForData(dataForPlot);
                lastLoadedDataForPlot = dataForPlot;
            });

        };
        $scope.loadData = loadData;
        timeoutHelper.setInterval(loadData, AppConfig.tempHistory.Interval);

        $("<div id='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            border: "1px solid #fdd",
            padding: "5px",
            "background-color": "#fee",
            opacity: 0.90,
            "border-radius": "10px"
        }).appendTo("#viewContainer");

        var plot = null;
        /**
         *
         * @param {DataAndDescription} data
         */
        var drawPlotForData = function (data)
        {
            var histories = data.histories;
            var dataForPlot = [];

            var idx = 0;
            var prepareData = function (historyArray, labelPrefix)
            {
                for (var sensorHistory in historyArray)
                {
                    dataForPlot.push(
                        {
                            //label: sensorHistory,
                            label: (labelPrefix ? (labelPrefix + ' ') : '') + data.descriptions.reduce(function (acc, e)
                            {
                                return (e.innerId == sensorHistory ? e.name : acc);
                            }, 'Unknown'),
                            points: {show: true},
                            lines: {show: true},
                            data: historyArray[sensorHistory].reduce(function (acc, e)
                            {
                                var d = new Date(e.date);
                                //d.setFullYear(1970, 0, 1);
                                acc.push(
                                    [
                                        (d.getTime() + (-d.getTimezoneOffset() * 60 * 1000)) % (1000 * 60 * 60 * 24),
                                        //d.getTime() + (-d.getTimezoneOffset() * 60 * 1000),
                                        e.temp
                                    ]);
                                return acc;
                            }, []),
                            idx: idx++

                        });
                }
            };

            for (var i in histories)
            {
                prepareData(histories[i].history, histories[i].labelPrefix)
            }

            var togglePlot = function (seriesIdx)
            {
                if (plot)
                {
                    var someData = plot.getData();
                    someData[seriesIdx].lines.show = !someData[seriesIdx].lines.show;
                    someData[seriesIdx].points.show = !someData[seriesIdx].points.show;
                    plot.setData(someData);
                    plot.draw();
                }
            };


            var xMin = new Date(0);
            var xMax = new Date(xMin.getTime());
            xMax.setDate(xMax.getDate() + 1);


            plot = $.plot("#plot", dataForPlot, {
                xaxis: {
                    mode: "time",
                    tickSize: AppConfig.tempHistory.getHourTickSize("#plot"),
                    min: xMin.getTime(),
                    max: xMax.getTime()
                },
                grid: {
                    hoverable: true
                },
                yaxis:{
                    tickSize: 1
                },
                legend: {
                    labelFormatter: function (label, series)
                    {
                        return '<span style="cursor:pointer;" class="myLegend" series="' + series.idx + '">' + label + '</span>';
                    }
                }
            });

            $('.myLegend').on('click', function ()
            {
                togglePlot($(this).attr('series'));
                $(this).toggleClass('text-muted');
            });

            $('#plot').bind("plothover", function (event, pos, item)
            {

                if (item)
                {
                    var time = item.datapoint[0],
                        temp = item.datapoint[1].toFixed(1);

                    var d = new Date(time);
                    d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);

                    var h = d.getHours(),
                        m = d.getMinutes();


                    var stringDate = h + ":" + (m < 10 ? '0' : '') + m;


                    $("#tooltip").html(temp + ' C at ' + stringDate)
                        .css({top: item.pageY + 20, left: item.pageX + 20})
                        .show();
                }
                else
                {
                    $("#tooltip").hide();
                }

            });

        };


        //
        AppConfig.tempHistory.setHeightByWidth('#plot');
        var onResize = function ()
        {
            if (plot)
            {
                AppConfig.tempHistory.setHeightByWidth('#plot');

                var opts = plot.getOptions();


                opts.xaxes[0].tickSize = AppConfig.tempHistory.getHourTickSize("#plot");

                plot.resize();
                plot.setupGrid();
                plot.draw();
            }
        };


        var onResizeController = new (function ()
        {
            var lastResize = null;
            var rawOnResize = function ()
            {
                if (lastResize != null) clearTimeout(lastResize);
                lastResize = setTimeout(onResize, AppConfig.tempHistory.DelayBeforeAcceptResizing);
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


    });


/**
 *  @typedef {Object} DataAndDescription
 *  @property {Array.<{labelPrefix:string, history:{temp:Number, date:string}}>} histories temp history data
 *  @property {Array.<DS18B20DDescriptionObject>} descriptions sensors descriptions
 */