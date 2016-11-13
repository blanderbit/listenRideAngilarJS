var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 9003));
app.use(express.static(__dirname + '/listnride/dist'));
app.get('/', function (req, res) {
  res.render('index');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

