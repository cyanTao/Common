var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('./key/privatekey.pem', 'utf8'); //密钥路径,编码
var certificate = fs.readFileSync('./key/certificate.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 3030; //http 端口
var SSLPORT = 443; //https 端口

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

// Welcome
app.get('/', function(req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('Welcome https!');
    }
    else {
        res.status(200).send('Welcome http!');
    }
});