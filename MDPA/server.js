var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/'));

var server = app.listen('80', 'h5.zhuishushenqi.com', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('访问地址为：http://%s:%s', host, port);
});