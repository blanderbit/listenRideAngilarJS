"use strict";

var middleware = {
  helmet: require('helmet'),
  express: require('express'),
  expressEnforcesSSL: require('express-enforces-ssl')
};
/*
 * file and dirertory for index and index-shop template files
 */
var staticServe = {
  "dir": "/listnride/dist", 
  "prod": { "file": "index.html", "dir": "/listnride/dist" },
  "shop": { "file": "index-shop.html", "dir": "/listnride/dist" },
};

// express app & servings
middleware.app =  middleware.express();
staticServe.serve = { index: staticServe.prod.file };

var retrieveTld = function (hostname) {
  return hostname.replace(/^(.*?)\listnride/, "");
};
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
  return url;
};
/*
 * returns boolean for either redirection should be used or not
 * redirection is only used for production and staging
 */
var shouldRedirect = function (host) {
  return host.includes("listnride.com") ||
         host.includes("listnride.de")  ||
         host.includes("listnride.nl")  ||
         host.includes("listnride.it")  ||
         host.includes("listnride.es");
};
/*
 * force https redirect for staging and production
 * not used for local host and heroku review apps
 */
var enableHttps = function () {
  // prerender
  middleware.app.use(require('prerender-node').set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));
  // setting proper http headers
  middleware.app.use(middleware.helmet());
  // redirect to https
  middleware.app.enable('trust proxy');
  middleware.app.use(middleware.expressEnforcesSSL());
};
/*
 * refirect to proper domain on staging and production
 * should not redirect for local host and heroku review apps
 */
var redirectToProperDomain = function (req, res, next) {
  // console.log("should redirect: ", shouldRedirect(req.headers.host));
  if (shouldRedirect(req.headers.host)) {
    var host = stripTrailingSlash(determineHostname(req.subdomains, req.hostname));
    var url = stripTrailingSlash(req.originalUrl);
    if (req.hostname !== host || req.originalUrl !== url) {
      res.redirect(301, "https://" + host + url);
      return;
    }
  }
  next();
};
/*
 * log the request
 * no functional use, only for debugging
 */
var logger = function (req) {
  if (req.originalUrl.includes("app-shop")) {
    var origin = req.headers.host;
    console.log("\norigin: ", origin);
    console.log("query: ", req.query);
    console.log("params: ", req.params);
    console.log("shop param: ", req.query.shop);
    console.log("bike param: ", req.query.bikeId);
    console.log("original url: ", req.originalUrl);
  }
};
/* enable_https_start */
// removeIf(middleware)
enableHttps();
// endRemoveIf(middleware)
/* enable_https_end */

/*
 * proper redirects
 */
middleware.app.use(function (req, res, next) {
  redirectToProperDomain(req, res, next);
});
/*
 * by default serves index.html
 * http://expressjs.com/en/4x/api.html#express.static
 */
middleware.app.use(
  middleware.express.static(__dirname.concat(staticServe.dir), staticServe.serve)
);
/*
 * start middleware
 */
middleware.app.set('port', (process.env.PORT || 9003));
middleware.app.listen(middleware.app.get('port'));