var helmet = require('helmet');
var express = require('express');
var expressEnforcesSSL = require('express-enforces-ssl');
var prerender = require('prerender-node');
var app = express();
var logger = function (req, res, next) {
  next();
};

// prerender
app.use(require('prerender-node').set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));

// setting proper http headers
app.use(helmet());

// redirect to https
app.enable('trust proxy');
app.use(expressEnforcesSSL());

// get port from env
app.set('port', (process.env.PORT || 9003));

// see all transactions through server
app.use(logger);

var determineUrl = function(language) {
  switch (language) {
    case "en": return "listnride.com";
    case "de": return "listnride.de";
    case "nl": return "listnride.nl";
    case "it": return "listnride.it";
    default: return "listnride.com";
  }
};

// proper redirects based on browser language
app.use(function(req, res, next) {
	var language = req.acceptsLanguages("en", "de", "nl", "it") || "en";
  var correctUrl = determineUrl(language);
  if (req.hostname == correctUrl) {
    next();
  } else {
    var destination = "";
    if (req.subdomains[req.subdomains.length - 1] === "staging") {
      destination = "https://www." + determineUrl(language) + req.originalUrl;
    } else {
      destination = "https://www.staging." + determineUrl(language) + req.originalUrl;
    }
    res.redirect(302, destination);
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
