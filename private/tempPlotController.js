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

        $http.get('api/temp_1wire/history/list').
            success(function (data, status, headers, config)
            {
                $scope.listsOfHistories = data.reduce(function (acc, e)
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
                $scope.selectedHistory = $scope.listsOfHistories[0];

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
                    tickSize: [1, 'hour']
                }
            });
        }


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
        setTimeout(loadData, AppConfig.tempHistory.StartDelay);
        setInterval(loadData, AppConfig.tempHistory.Interval);
        $scope.$watch('selectedHistory', loadData);

        var onResize = function ()
        {
            if (plot)
            {
                plot.resize();
                plot.setupGrid();
                plot.draw();
            }
        };

        (function ()
        {
            var lastResize = null;
            $(window).resize(function ()
            {
                if (lastResize != null) clearTimeout(lastResize);
                lastResize = setTimeout(onResize, AppConfig.tempHistory.DelayBeforeAcceptResizing);
            });
        })();


    })
;

/**
 *  @typedef {Object} DataAndDescription
 *  @property {Array.<{temp:Number, date:string}>} history temp history data
 *  @property {Array.<DS18B20DDescriptionObject>} descriptions sensors descriptions
 */