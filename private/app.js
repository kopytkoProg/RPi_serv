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