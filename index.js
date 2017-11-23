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

var determineTld = function(subdomains) {
  var domainPrefix = "www.";
  var domainEnding = ".com";
  console.log("subdomains are" + subdomains.toString());
  console.log("first subdomain is" + subdomains[0]);
  for (var i = 0; i < subdomains.length; i++) {
    switch (subdomains[i]) {
      case "en": domainEnding = ".com";
      case "de": domainEnding = ".de";
      case "nl": domainEnding = ".nl";
      case "it": domainEnding = ".it";
      case "staging": domainPrefix = "www.staging.";
      console.log(domainPrefix);
      console.log(domainEnding)
    }
  }
  console.log(domainPrefix + "listnride" + domainEnding);
  return domainPrefix + "listnride" + domainEnding;
};

var stripTrailingSlash = function(url) {
  return url.replace(/\/+$/, ""); 
}

// proper redirects
app.use(function(req, res, next) {
  console.log("starting redirect logic");
  var correctUrl = stripTrailingSlash(determineTld(req.subdomains));
  if (req.hostname === correctUrl) {
    console.log("proper hostname, no redirect necessary");
    next();
  } else {
    console.log("redirecting from hostname " + req.hostname + ", to correct Url " + correctUrl);
    res.redirect(301, "https://" + correctUrl + req.originalUrl);
  }
	// var language = req.acceptsLanguages("en", "de", "nl", "it") || "en";
 //  var correctUrl = req.subdomains.reverse().join(".") + "." + determineTld(language);
 //  if (req.hostname == correctUrl) {
 //    next();
 //  } else {
 //    // res.redirect(302, "https://" + correctUrl + req.originalUrl);
 //    next();
 //  }
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
