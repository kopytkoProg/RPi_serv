/**
 * Created by michal on 2014-12-21.
 */


var crc = function (data)
{
    return data.reduce(function (acc, e)
    {
        acc += e;
        return acc & 255;
    }, 0);
};

var MsgClass = function (address, command, data)
{

    this.address = address;
    this.command = command;
    this.data = data || [];

    this.toArray = function ()
    {
        var rawHeader = [this.address, this.command, this.data.length];
        var rawMsg = rawHeader.concat(this.data);

        return rawMsg;
    };

    this.get = function ()
    {
        var rawMsg = this.toArray();
        rawMsg.push(crc(rawMsg));
        return rawMsg;
    };

    this.getCrc = function ()
    {
        return crc(this.toArray());
    }

};

module.exports = MsgClass;