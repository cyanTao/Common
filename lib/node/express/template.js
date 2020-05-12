const express = require('express')
const xtpl = require('xtpl')
const bodyParser = require('body-parser')
const multipart = require('connect-multiparty');

const app = express()
const router = express.Router()
const multipartMiddleware = multipart();

app.use(multipartMiddleware)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// 设置静态资源文件夹为static
app.use(express.static('./dist'))
//设置模板,会自动去views文件夹中查找.html
app.set('views', './dist')
//设置当前视图引擎中的模板的扩展名.html
app.set('views engine', '.html')
//设置解析views/.html模板的方法xtpl.renderFile,它会自动代替res.render()方法，从而使得程序
的扩展性变强
app.engine('html', xtpl.renderFile)

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header('Access-Control-Allow-Methods', 'POST,GET')
  if (req.method.toLowerCase() == 'options') res.send(200)
  else next()
})

app.use('/', router)

app.listen('8080', () => {
  console.log('http://127.0.0.1:8080')
})