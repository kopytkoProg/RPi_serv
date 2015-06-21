/**
 * Created by michal on 2014-12-05.
 */
var crypto = require('crypto');
// var sqlite3 = require('sqlite3').verbose();

// var database = new sqlite3.Database('mydb.db');

//database.serialize(function ()
//{
//
//    database.run("CREATE TABLE if not exists Users (Username TEXT, Password TEXT)");
//
//    //var stmt = db.prepare("INSERT INTO Users VALUES (?, ?)");
//    //stmt.run(['michal', 'deff10bf1314f391fac984bb204d2175d73e6f2c5de189659554397e9c4afe6a']);
//    //stmt.finalize();
//});

//database.each("SELECT * FROM Users", function (err, row)
//{
//    console.log(row.Username + ": " + row.Password);
//});

//database.close();


var Users = function ()
{
    // var db = new sqlite3.Database('mydb.db');


    var users = [
        {
            Username: 'michal',
            Password: 'deff10bf1314f391fac984bb204d2175d73e6f2c5de189659554397e9c4afe6a'
        }
    ];

    function hash(txt)
    {
        var sha256 = crypto.createHash('sha256');
        return sha256.update(txt).digest('hex');
    }

    this.findOneUser = function (login, password, callback)
    {
        var f = function(users)
        {
            var filtered = users.filter(function (e)
            {
                return e.Username == login && e.Password == hash(password);
            });

            if (filtered.length > 0)
            {
                delete filtered[0].Password;
                callback(filtered[0]);
            }
            else
            {
                callback(null);
            }
        };

        f(users);
        //var users = [];
        //
        //db.all("SELECT * FROM Users", function (err, rows)
        //{
        //    users = rows
        //    //console.log(rows);
        //    f(users);
        //
        //});

    }

};

module.exports = new Users();