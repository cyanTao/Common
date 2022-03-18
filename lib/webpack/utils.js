const packageConfig = require('../package.json')
const path = require('path')
const os = require('os');
const portfinder = require('portfinder')

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')
  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()
    console.error(error.message)
    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.getHost = () => {
  const os = require('os')
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

exports.getPort = port => new Promise((resolve, reject) => {
  const portfinder = require('portfinder')
  portfinder.basePort = port
  portfinder.getPort((err, newPort) => {
    if (err) {
      reject(err)
    } else {
      resolve(newPort)
    }
  })
})

exports.cyan = text => {
  return '\033[34m' + text
}