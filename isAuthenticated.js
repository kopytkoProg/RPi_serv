
var redirectIfNotAuthenticated = function (req, res, next)
{
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}


var sendUnauthorizedIfUnauthenticated = function (req, res, next)
{
    if (req.isAuthenticated())
        return next();

    res.status(401);
    res.end('401 pls login', 'utf8');
}

module.exports = {
    redirectIfNotAuthenticated: redirectIfNotAuthenticated,
    sendUnauthorizedIfUnauthenticated : sendUnauthorizedIfUnauthenticated
};