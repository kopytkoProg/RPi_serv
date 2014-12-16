/**
 * Created by michal on 2014-12-06.
 */
var myModule = angular.module('myModule', ['ngRoute']);


myModule.config(function ($routeProvider)
{

    $routeProvider.
        when('/actual-temp.html', {
            templateUrl: 'actual-temp.html',
            controller: 'myController'
        }).
        when('/temp-history.html', {
            templateUrl: 'temp-history.html',
            controller: 'tempPlotController'
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
                return $q.reject(rejection);
            }
        };
    });
});

myModule.factory('AppConfig', function ()
{
    function APPConfigClass()
    {

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
            StartDelay: 1000 * 1,
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

                return msLeftToNextDay;
            },
            getHourTickSize: function ()
            {
                if ($('#plot').width() < 800) return [2, 'hour'];
                else return [1, 'hour'];
            }
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
        if (run) intervals.push(setInterval(code, delay));
    };
    /**
     @param {String|Function} code
     @param {number} delay
     */
    this.setTimeout = function (code, delay)
    {
        if (run) timeouts.push(setTimeout(code, delay));
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

