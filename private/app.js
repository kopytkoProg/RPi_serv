/**
 * Created by michal on 2014-12-06.
 */
var myModule = angular.module('myModule', []);

myModule.config(function ($httpProvider)
{
    $httpProvider.interceptors.push(function ()
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
            RefreshTime: 2000
        };

        this.Disk = {
            RefreshTime: 1000 * 60 * 60
        };

        this.CpuUsage = {
            RefreshTime: 5000
        };

        this.Os = {
            RefreshTime: 5000
        };

    }

    return  new APPConfigClass();
});


