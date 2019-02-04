var express = require('express');
var server = express();
server.use(require('connect-history-api-fallback')());
server.use('/', express.static(__dirname + '/dist/'));
var instance = server.listen(3030, function () {

    var host = instance.address().address;
    var port = instance.address().port;
    console.log("Example app listening at http://%s:%s", host, port)

});
