/**
 * Created by michal on 2014-12-15.
 */

///history/date/:date

myModule.controller('tempPlotController',
    /**
     * @param $scope
     * @param $http
     * @param {APPConfigClass} AppConfig
     */
    function ($scope, $http, $q, AppConfig)
    {

        var timeoutHelper = new TimeoutHelper();


        /**
         * @param {string} selectedScopeVariable Scope variable which contain selected date
         * @param {string} listScopeVariable Scope variable which contain list of histories
         * @constructor
         */
        var SelectList = function (selectedScopeVariable, listScopeVariable, onDataLoaded)
        {
            var load = function ()
            {
                $http.get('api/temp_1wire/history/list').
                    success(function (data, status, headers, config)
                    {
                        $scope[listScopeVariable] = data.reduce(function (acc, e)
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

                        $scope[selectedScopeVariable] = $scope[listScopeVariable].reduce(function (acc, e)
                        {
                            if ($scope[selectedScopeVariable] && $scope[selectedScopeVariable].date.getTime() == e.date.getTime())
                            {
                                return e;
                            }
                            return acc;
                        }, $scope[listScopeVariable][0]);


                        onDataLoaded();
                    });

                timeoutHelper.setTimeout(load, AppConfig.callOrVal(AppConfig.tempHistory.ListOfHistoriesRefreshInterval));
            };
            load();
        };

        new SelectList('selectedHistory', 'listsOfHistories', function(){
            timeoutHelper.setTimeout(loadData, AppConfig.tempHistory.StartDelay);
        });

        var plot = null;
        /**
         *
         * @param {DataAndDescription} data
         */
        var drawPlotForData = function (data)
        {
            var historyArray = data.history;
            var dataForPlot = [];

            for (var sensorHistory in historyArray)
            {
                dataForPlot.push(
                    {
                        //label: sensorHistory,
                        label: data.descriptions.reduce(function (acc, e)
                        {
                            return acc || (e.innerId == sensorHistory ? e.name : null);
                        }, null),
                        points: {show: true},
                        lines: {show: true},
                        data: historyArray[sensorHistory].reduce(function (acc, e)
                        {
                            var d = new Date(e.date);
                            acc.push(
                                [
                                    d.getTime() + (-d.getTimezoneOffset() * 60 * 1000),
                                    e.temp
                                ]);
                            return acc;
                        }, [])
                    });
            }
            plot = $.plot("#plot", dataForPlot, {
                xaxis: {
                    mode: "time",
                    tickSize: AppConfig.tempHistory.getHourTickSize()//[2, 'hour']
                }
            });
        };


        var loadData = function ()
        {
            if ($scope.selectedHistory)
            {
                var getDataDefer = $q.defer();
                var getDescriptionsDefer = $q.defer();

                $http.get('/api/temp_1wire/history/date/' + $scope.selectedHistory.date).
                    success(function (data, status, headers, config)
                    {
                        getDataDefer.resolve(data);
                    }).
                    error(function (data, status, headers, config)
                    {
                        getDataDefer.reject(data);
                    });

                $http.get('api/temp_1wire/sensors/descriptions').
                    success(function (data, status, headers, config)
                    {
                        getDescriptionsDefer.resolve(data);
                    }).
                    error(function (data, status, headers, config)
                    {
                        getDescriptionsDefer.reject(data);
                    });


                $q.all([getDataDefer.promise, getDescriptionsDefer.promise]).then(function (d)
                {
                    /**
                     * @type {DataAndDescription}
                     */
                    var dataForPlot = {};
                    dataForPlot.history = d[0].history;
                    dataForPlot.descriptions = d[1];

                    drawPlotForData(dataForPlot);
                });
            }
        };
        $scope.loadData = loadData;
        timeoutHelper.setInterval(loadData, AppConfig.tempHistory.Interval);
        //$scope.$watch('selectedHistory', loadData);

        var onResize = function ()
        {
            if (plot)
            {
                var opts = plot.getOptions();
                console.log(opts);

                opts.xaxes[0].tickSize = AppConfig.tempHistory.getHourTickSize();

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
 *  @property {Array.<{temp:Number, date:string}>} history temp history data
 *  @property {Array.<DS18B20DDescriptionObject>} descriptions sensors descriptions
 */