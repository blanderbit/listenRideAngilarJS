var helmet = require('helmet');
var express = require('express');
var expressEnforcesSSL = require('express-enforces-ssl');
var prerender = require('prerender-node');
var app = express();
var logger = function (req, res, next) {
  next();
};

// setting proper http headers
app.use(helmet());

// redirect to https
app.enable('trust proxy');
app.use(expressEnforcesSSL());

// prerender
app.use(prerender.set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));

// get port from env
app.set('port', (process.env.PORT || 9003));

// see all transactions through server
app.use(logger);

app.use(function (req, res, next) {
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
    return next();
  }
});

// by default serves index.html
// http://expressjs.com/en/4x/api.html#express.static
app.use(express.static(__dirname.concat('/listnride/dist'), {index: 'index.html'}));

/*
removing this will disable serving urls from browser

it will only be called when there is some url
otherwise app.use(express.static ...) will be called

sometimes it will get called even on root in case of chrome
that is because 'angular-sanitize.min.js.map' is missing
and chrome requests it. not for safari and firefox
*/
app.use('/*', function (req, res) {

  res.sendFile(__dirname.concat('/listnride/dist/index.html'));
});

app.listen(app.get('port'), function () {
});
