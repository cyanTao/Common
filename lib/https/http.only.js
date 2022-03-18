// 启动https服务需要https包
// 读取文件需要fs包
const https = require('https');
const fs = require('fs');

// 将两个证书文件读取放到options对象中
// 使用readFileSync()方法，顺序地执行读文件和启动服务操作
const options = {
	key: fs.readFileSync('./key/privatekey.pem'), //密钥路径
	cert: fs.readFileSync('./key/certificate.pem')
};

// 创建服务器，启动服务器，设置监听端口号写在一起
https.createServer(options, (req, res) => {
	res.end('hello world\n');
}).listen(443);
console.log('https服务启动成功：https://127.0.0.1')