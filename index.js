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
app.use('/', express.static(__dirname + '/listnride/dist'));

// redirection
app.use(prerender.set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));
app.use('/en', function (req, res)                  {redirectTo(re);});
app.use('/de', function (req, res)                  {redirectTo(re);});
app.use('/faq', function (req, res)                 {redirectTo(res,'/help');});
app.use('/impress', function (req, res)             {redirectTo(res,'/imprint');});
app.use('/RaphaSuperCross', function (req, res)     {redirectTo(res,'/rapha-super-cross');});
app.use('/rides', function (req, res)               {redirectTo(res, '/bikes');});
app.use('/bikes/map', function (req, res)           {redirectTo(res, '/search');});
app.use('/user/signup', function (req, res)         {redirectTo(res);});
app.use('/velothon', function (req, res)            {redirectTo(res, '/search/berlin?race=true');});
app.use('/inveloveritas', function (req, res)       {redirectTo(res);});
app.use('/InVeloVeritas', function (req, res)       {redirectTo(res);});
app.use('/TemplinTriathlon', function (req, res)    {redirectTo(res);});
app.use('/templintriathlon', function (req, res)    {redirectTo(res);});
app.use('/8bar-crit', function (req, res)           {redirectTo(res);});
app.use('/8bar-Crit', function (req, res)           {redirectTo(res);});

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/listnride/dist/index.html');
});

app.listen(app.get('port'), function () {
  console.log('connection port: ', app.get('port'));
});