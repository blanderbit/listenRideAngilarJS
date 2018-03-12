"use strict";

var helmet = require('helmet');
var express = require('express');
var expressEnforcesSSL = require('express-enforces-ssl');
var prerender = require('prerender-node');
var app = express();

// force https redirect for staging and production
// not used for local host and heroku review apps
var httpForceRoute = function () {
  // prerender
  app.use(require('prerender-node').set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));

  // setting proper http headers
  app.use(helmet());

  // redirect to https
  app.enable('trust proxy');
  app.use(expressEnforcesSSL());
};

// refirect to proper domain on staging and production
// not used for local host and heroku review apps
var redirectToProperDomain = function (req, res, next) {
  var correctHostname = stripTrailingSlash(determineHostname(req.subdomains, req.hostname));
  var correctOriginalUrl = stripTrailingSlash(req.originalUrl);
  if (req.hostname === correctHostname && req.originalUrl === correctOriginalUrl) {
    next();
  } else {
    next();
    res.redirect(301, "https://" + correctHostname + correctOriginalUrl);
  }
};

// log the request
// no functional use, only for debugging
var logger = function (req) {
  var origin = req.headers.host;
  console.log("req obj: ", req);
  console.log("origin: ", origin);
  console.log("params: ", req.query);
  console.log("is_shop params: ", req.query.is_shop);
};

// get port from env
app.set('port', (process.env.PORT || 9003));

var determineHostname = function (subdomains, hostname) {
  var domainPrefix = "www.";
  var domainEnding = retrieveTld(hostname);
  for (var i = 0; i < subdomains.length; i++) {
    switch (subdomains[i]) {
      case "en":
        domainEnding = ".com";
        break;
      case "de":
        domainEnding = ".de";
        break;
      case "nl":
        domainEnding = ".nl";
        break;
      case "it":
        domainEnding = ".it";
        break;
      case "es":
        domainEnding = ".es";
        break;
    }
    if (subdomains[i] === "staging") {
      domainPrefix = "www.staging.";
    }
  }
  return domainPrefix + "listnride" + domainEnding;
};

var stripTrailingSlash = function (url) {
  // return url.replace(/\/+$/, "");
  return url;
};

var retrieveTld = function (hostname) {
  return hostname.replace(/^(.*?)\listnride/, "");
};

// proper redirects
app.use(function (req, res, next) {
  // redirectToProperDomain(req, res, next);
  next();
});

// by default serves index.html
// http://expressjs.com/en/4x/api.html#express.static
app.use(express.static(__dirname.concat('/listnride/dist'), {
  index: 'index.html'
}));

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

app.listen(app.get('port'));