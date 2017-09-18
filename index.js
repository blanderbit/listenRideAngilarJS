var express = require('express');
var prerender = require('prerender-node');
var app = express();
// redirector function
var redirectTo = function (res, to) {
  res.redirect(301, to || '/');
};
var logger = function (req, res, next) {
  console.log(new Date(), req.originalUrl);
  next();
}
// prerender
app.use(require('prerender-node').set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));
// get port from env
app.set('port', (process.env.PORT || 9003));
// see all transactions through server 
app.use(logger);

app.use(function(req, res, next) {
  var lastSubdomain = req.subdomains[req.subdomains.length - 1];
  if (lastSubdomain === 'www') {
    var host = req.get('host');
    var subdomainlessHost = host.substr(host.indexOf("."));
    var language = req.acceptsLanguages("en", "de", "nl");
    var newURL;
    if (language) {
      newURL = req.protocol + "://" + language + subdomainlessHost + req.originalUrl;
    } else {
      newURL = req.protocol + "://en" + subdomainlessHost + req.originalUrl;
    }
    res.redirect(302, newURL);
  } else {
    next();
  }
});

// by default serves index.html
// http://expressjs.com/en/4x/api.html#express.static
app.use(express.static(__dirname + '/listnride/dist', {index: 'index.html'}));

/*
removing this will disable serving urls from browser

it will only be called when there is some url
otherwise app.use(express.static ...) will be called

sometimes it will get called even on root in case of chrome
that is because 'angular-sanitize.min.js.map' is missing
and chrome requests it. not for safari and firefox
*/
app.use('/*', function (req, res) {
  console.log('inside /*');
  res.sendFile(__dirname + '/listnride/dist/index.html');
});

app.listen(app.get('port'), function () {
  console.log('connection port: ', app.get('port'));
});