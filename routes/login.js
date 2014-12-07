var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');


/* GET home page. */
//router.post('/', passport.authenticate('login', {
//    successRedirect: '/',
//    failureRedirect: '/',
//    failureFlash : true
//}));
router.post('/',
    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);



router.get('/', function (req, res) {

    var c = 0, p, f = req.flash();
    for (p in f) c += 1;


    res.render('login', {
        anyError: c > 0,
        massages: JSON.stringify(f, null, "\t")
    });

});

router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
});

module.exports = router;
