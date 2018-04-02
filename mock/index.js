const Koa = require('koa')
const bodyParser = require('koa-bodyparser') // 引入post参数解析
const router = require('./router') // 引入配置路由
const app = new Koa()

// console.log(process.env.NODE_ENV);

app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())

app.listen(6666, () => {
  console.log(`server start at 6666 port`)
})
