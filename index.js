var express = require('express');
var prerender = require('prerender-node');
var app = express();

app.set('port', (process.env.PORT || 9003));
app.use(express.static(__dirname + '/listnride/dist'));
app.use(prerender.set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/listnride/dist/index.html');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

