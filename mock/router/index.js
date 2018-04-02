const Router = require('koa-router')

const kySecurity = require('./kySecurity')

let router = new Router()
router.use('/kySecurity', kySecurity.routes(), kySecurity.allowedMethods())

module.exports = router
