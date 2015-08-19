/**
 * Created by michal on 21.07.15.
 */

var Utils = {
    countNumberOfFields: function (obj) {
        var c = 0, p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                c += 1;
            }
        }

        return c;
    },

    cloneArray: function (arr) {
        return arr.slice(0);
    }


};



Object.defineProperty(Array.prototype, "findFirst", {
    enumerable: false,
    writable: true
});

/**
 @param {function(T=, number=, Array.<T>=)} callback
 @return {T}
 @template T
 */
Array.prototype.findFirst = function (callback) {
    return this.filter(
    function (e, i, arr) {
        return callback(e, i, arr);
    })[0];
};

for (var x in [1,2]){
    console.log (x);
}
module.exports = Utils;