/**
 * Created by michal on 2014-12-06.
 */
var myModule = angular.module('myModule', []);

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
            StartDelay: 1000 * 2,
            DelayBeforeAcceptResizing: 500
        };

    }

    return new APPConfigClass();
});


