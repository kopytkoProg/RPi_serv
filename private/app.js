/**
 * Created by michal on 2014-12-06.
 */
var myModule = angular.module('myModule', ['ngRoute']);


myModule.config(function ($routeProvider)
{

    $routeProvider.
        when('/actual-temp.html', {
            templateUrl: 'actual-temp.html',
            controller: 'actualTempController'
        }).
        when('/temp-history.html', {
            templateUrl: 'temp-history.html',
            controller: 'tempPlotController'
        }). when('/new-temp-history.html', {
            templateUrl: 'new-temp-history.html',
            controller: 'newTempPlotController'
        }).
        when('/temp-compare-history.html', {
            templateUrl: 'temp-compare-history.html',
            controller: 'tempComparePlotController'
        }).
        when('/led.html', {
            templateUrl: 'led.html',
            controller: 'ledController'
        }).
        when('/device-diagnostic.html', {
            templateUrl: 'device-diagnostic.html',
            controller: 'deviceDiagnosticController'
        }).
        when('/move-sensors-history.html', {
            templateUrl: 'move-sensors-history.html',
            controller: 'moveSensorsHistoryController'
        }).
        when('/esp-devices-diagnostic.html', {
            templateUrl: 'esp-devices-diagnostic.html',
            controller: 'espDevicesDiagnosticController'
        }).
        otherwise({
            redirectTo: '/actual-temp.html'
        });


});


myModule.config(function ($httpProvider)
{
    $httpProvider.interceptors.push(function ($q)
    {
        return {
            responseError: function (rejection)
            {
                if (rejection.status == '401') location.reload();
                $.notify('Error: ' + rejection.status + ' ' + JSON.stringify(rejection.config, null, 4), "error");
                return $q.reject(rejection);
            }
        };
    });
});

myModule.factory('AppConfig', function ()
{
    /**
     *
     * @constructor APPConfigClass
     */
    function APPConfigClass()
    {
        var _this = this;
        this.global = {
            monthsName: [
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
            ],
            plot: {
                getHourTickSize: function (plotElement)
                {
                    var width = $(plotElement).width();
                    if (width < 800) return [4, 'hour'];
                    else if (width < 800) return [2, 'hour'];
                    else return [1, 'hour'];
                },
                getTempTickSize: function (difference) {
                    if (difference <= 30) return 1;
                    if (30 < difference && difference <= 60) return 2;
                    if (60 < difference) return 5;
                },
                setHeightByWidth: function (plotElement)
                {
                    var width = $(plotElement).width();
                    if (width > 1000) $(plotElement).height(600);
                    else $(plotElement).height(400);
                },
                DelayBeforeAcceptResizing: 200
            }
        };

        this.devicesDiagnostic = {
            Interval: 5000
        };

        this.sensors = {
            Interval: 1000 * 60 * 5
        };

        this.devices = {
            Led: {
                Interval: 5000
            }
        };

        this.Temp = {
            Interval: 2000
        };

        this.Disk = {
            Interval: 1000 * 60 * 60
        };

        this.CpuUsage = {
            Interval: 5000
        };

        this.Os = {
            Interval: 5000
        };

        this.tempHistory = {
            Interval: 1000 * 60 * 5,
            StartDelay: 1000 * 0.5,
            DelayBeforeAcceptResizing: 200,
            /***
             * @type {(Number, Function)}
             */
            ListOfHistoriesRefreshInterval: function ()
            {
                var now = new Date();
                var tomorrow = new Date(now.getTime());
                tomorrow.setHours(0, 0, 0, 0);
                tomorrow.setDate(tomorrow.getDate() + 1);
                var msLeftToNextDay = tomorrow.getTime() - now.getTime();

                return msLeftToNextDay + 1000 * 10;
            },
            getTempTickSize: _this.global.plot.getTempTickSize,
            getHourTickSize: _this.global.plot.getHourTickSize /*function (plotElement)
             {
             var width = $(plotElement).width();
             if (width < 800) return [4, 'hour'];
             else if (width < 800) return [2, 'hour'];
             else return [1, 'hour'];
             }*/,
            setHeightByWidth: _this.global.plot.setHeightByWidth/* function (plotElement)
             {
             var width = $(plotElement).width();
             if (width > 1000) $(plotElement).height(600);
             else $(plotElement).height(400);
             }*/

        };


        // -----------------------------------------------------------------
        this.callOrVal = function (v)
        {
            return typeof v == 'function' ? v() : v
        };

    }


    return new APPConfigClass();
});


myModule.directive('activeLink', function ($location)
{
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller)
        {
            var cssClass = attrs.activeLink;
            var path = $(element).find('a').first().attr('href');
            path = path.substring(1);

            scope.$on('$routeChangeSuccess', function ()
            {
                var newPath = $location.path().substr(0, path.length);
                if (path === newPath)
                {
                    element.addClass(cssClass);
                }
                else
                {
                    element.removeClass(cssClass);
                }
            });
        }
    }
});

myModule.directive('loading', function ($http)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function ()
            {
                return $http.pendingRequests.length > 0;
            };
            var lastChange = null;
            scope.$watch(scope.isLoading, function (v)
            {
                if (lastChange != null) clearTimeout(lastChange);
                lastChange = setTimeout(function ()
                {
                    if (v)
                    {
                        elm.visible();
                    }
                    else
                    {
                        elm.invisible();
                    }
                }, 500);

            });
        }
    };

});


var TimeoutHelper = function ()
{
    var run = true;
    var intervals = [];
    var timeouts = [];

    this.clearAll = function ()
    {
        run = false;
        timeouts.forEach(function (e)
        {
            clearTimeout(e)
        });
        intervals.forEach(function (e)
        {
            clearInterval(e)
        });
    };

    /**
     @param {String|Function} code
     @param {number} delay
     */
    this.setInterval = function (code, delay)
    {
        if (run)
        {
            var r = setInterval(code, delay);
            timeouts.push(r);
            return r;
        }

    };
    /**
     @param {String|Function} code
     @param {number} delay
     */
    this.setTimeout = function (code, delay)
    {
        if (run)
        {
            var r = setTimeout(code, delay);
            timeouts.push(r);
            return r;
        }

    };


    /**
     * This function return number of millisecond remaining to next full timeSpan.
     * @param {number} timeSpan for example if it is 5min and time is 15:23 then return value is time in ms to 15:25.
     * @param {Date} [date] date to compute tick if null then current time used.
     */
    this.getTimeOfNextTick = function (timeSpan, date)
    {
        date = date || new Date();
        var t = timeSpan - (date.getTime() % (timeSpan));
        return t;
    };
};


(function ($)
{
    $.fn.invisible = function ()
    {
        return this.each(function ()
        {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function ()
    {
        return this.each(function ()
        {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

