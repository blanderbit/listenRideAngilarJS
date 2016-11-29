var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 9003));
app.use(express.static(__dirname + '/listnride/dist'));
app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000/').set('prerenderToken', 'W8S4Xn73eAaf8GssvVEw'));
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/listnride/dist/index.html');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

