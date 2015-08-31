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

/**
 @param {T} self
 @return {function( ...*)}
 @template T
 */
Function.prototype.callAs = function (self) {
    var f = this;
    return function () {
        return f.apply(self, arguments);
    }
};

module.exports = Utils;