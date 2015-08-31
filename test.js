/**
 * Created by michal on 31.08.15.
 */
var Q = require('q');

function a (){
    var d = Q.defer();
    setTimeout(function(){
        console.log('a');
        d.reject('ok 1');
    }, 1000);
    return d.promise;
}


function b (){
    var d = Q.defer();
    setTimeout(function(){
        console.log('b');
        d.resolve('ok 2');
    }, 1000);
    return d.promise;
}

a().then(b).then(function(v){console.log('Done!', v)}).fail(function(v){console.log('FAIL!', v)});