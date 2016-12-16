var express = require('express');
var prerender = require('prerender-node');
var app = express();
// redirector function
var redirectTo = function(res, to) {
  res.redirect(301, to || '/');
};
// prerender
app.use(require('prerender-node').set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));
// get port from env
app.set('port', (process.env.PORT || 9003));
// configure static 
app.use(express.static(__dirname + '/listnride/dist'));

// redirection
app.use('/:lang(en|de)/rides/map/:location', function (req, res) {
  redirectTo(res, '/search/' + req.params.location);
});

app.use('/:lang(en|de)/rides/:id', function (req, res) {
  redirectTo(res, '/bikes/' + req.params.id);
});

app.use('/:lang(en|de)/user/signup', function (req, res) {
  redirectTo(res);
});

app.use('/:lang(en|de)/user/:id', function (req, res) {
  redirectTo(res, '/user/' + req.params.location);
});

app.use('/:lang(en|de)/how-it-works', function (req, res) {
  redirectTo(res, '/how-it-works');
});

app.use('/:lang(en|de)/about', function (req, res) {
  redirectTo(res, '/about');
});

app.use('/:lang(en|de)/faq', function (req, res) {
  redirectTo(res, '/faq');
});

app.use('/:lang(en|de)/jobs', function (req, res) {
  redirectTo(res, '/jobs');
});

app.use('/:lang(en|de)/press', function (req, res) {
  redirectTo(res, '/press');
});

app.use('/:lang(en|de)/impress', function (req, res) {
  redirectTo(res, '/imprint');
});

app.use('/:lang(en|de)/velothon', function (req, res) {
  redirectTo(res, '/search/berlin?race=true');
});

app.use('/:lang(en|de)/inveloveritas', function (req, res) {
  redirectTo(res);
});

app.use('/:lang(en|de)/8-bar-crit', function (req, res) {
  redirectTo(res);
});

app.use('/:lang(en|de)/TemplinTriathlon', function (req, res) {
  redirectTo(res);
});

app.use('/:lang(en|de)/RaphaSuperCross', function (req, res) {
  redirectTo(res, '/rapha-super-cross');
});

app.use('/:lang(en|de)', function(req, res) {
  redirectTo(res);
});

// file serving
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/listnride/dist/index.html');
});

app.listen(app.get('port'), function () {
  console.log('connection port: ', app.get('port'));
});