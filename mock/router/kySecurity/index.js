const Router = require('koa-router')

let kySecurity = new Router()

kySecurity.post('/login', async function (ctx) {
  const { username, password } = ctx.request.body
  console.log(username, password)
  ctx.body = {
    'result': 'BearereyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMDE1MzUxN30.jkLSInOSg4VQ6fb2FLq7QaMJ7ZXvg_V60gC6gq9AxhPYbPSs68jEhRxLCMZs53MNyTVLaxNVtCM_SPaE4zTZNQ',
    'message': 'SUCCESS',
    'status': 200,
    'type': 1,
    'name': '张三',
    'loginId': 100001
  }
})

kySecurity.get('/refreshToken', async function (ctx) {
  ctx.body = {
    'result': 'BearereyJhbGciOiJIUzUxMiJ1.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMDE1MzUxN30.jkLSInOSg4VQ6fb2FLq7QaMJ7ZXvg_V60gC6gq9AxhPYbPSs68jEhRxLCMZs53MNyTVLaxNVtCM_SPaE4zTZNQ',
    'message': 'SUCCESS',
    'status': 200
  }
})

kySecurity.get('/operator/all', async function (ctx) {
  ctx.body = {
    'endRow': 1,
    'firstPage': 1,
    'hasNextPage': false,
    'hasPreviousPage': false,
    'isFirstPage': true,
    'isLastPage': true,
    'lastPage': 1,
    'list': [
      {
        'authorize': 0,
        'loginId': '1',
        'name': '测试',
        'type': 1,
        'roleName': '省公司管理员'
      },
      {
        'authorize': 1,
        'loginId': '2',
        'name': '测试2',
        'type': 0,
        'roleName': ''
      }
    ],
    'navigateFirstPage': 1,
    'navigateLastPage': 1,
    'navigatePages': 8,
    'navigatepageNums': [
      1
    ],
    'nextPage': 0,
    'pageNum': 1,
    'pageSize': 10,
    'pages': 1,
    'prePage': 0,
    'size': 1,
    'startRow': 1,
    'total': 2
  }
})

kySecurity.post('/operator/delete', async function (ctx) {
  const { loginId } = ctx.request.body
  console.log(loginId)
  ctx.body = {
    message: 'SUCCESS'
  }
})

kySecurity.get('/OA/getOAUserByLoginId/1', async function (ctx) {
  ctx.body = {
    'OAUser': [
      {
        'loginId': 100001,
        'password': null,
        'lastName': '张三'
      },
      {
        'loginId': 100002,
        'password': null,
        'lastName': '李四'
      }
    ]
  }
})

kySecurity.post('/operator/add', async function (ctx) {
  const { name, type, loginId } = ctx.request.body
  console.log('name: %s, type: %s, loginId: %s', name, type, loginId)
  ctx.body = {
    message: 'SUCCESS'
  }
})

kySecurity.get('/role/findByOperator/1', async function (ctx) {
  ctx.body = {
    'role': [
      {
        'id': 1,
        'name': '测试数据一',
        'remark': null,
        'checked': 1,
        'logicaldel': 0
      },
      {
        'id': 2,
        'name': '测试数据二',
        'remark': null,
        'checked': 0,
        'logicaldel': 1
      }
    ]
  }
})
kySecurity.get('/role/findByOperator/2', async function (ctx) {
  ctx.body = {
    'role': [
      {
        'id': 1,
        'name': '测试数据一',
        'remark': null,
        'checked': 0,
        'logicaldel': 0
      },
      {
        'id': 2,
        'name': '测试数据二',
        'remark': null,
        'checked': 0,
        'logicaldel': 1
      }
    ]
  }
})
kySecurity.post('/role/updateByOperator', async function (ctx) {
  const {loginId, roleId} = ctx.request.body
  console.log('loginId: %s, roleId: %s', loginId, roleId)
  ctx.body = {
    message: 'SUCCESS'
  }
})
kySecurity.get('/role/get/1', async function (ctx) {
  ctx.body = {
    'id': 1,
    'name': '省公司管理员一',
    'remark': '省公司管理员备注文字',
    'logicaldel': 0,
    'resources': [
      {
        'id': 1,
        'parentId': null,
        'name': null,
        'type': null,
        'checked': null
      }
    ]
  }
})

kySecurity.get('/role/getResource', async function (ctx) {
  ctx.body = {
    'resource': [
      {
        'id': 1,
        'parentId': null,
        'name': null,
        'type': null,
        'checked': null
      },
      {
        'id': 2,
        'parentId': null,
        'name': null,
        'type': null,
        'checked': null
      }
    ]
  }
})

kySecurity.get('/role/all', async function (ctx) {
  ctx.body = {
    'role': [
      {
        'id': 1,
        'name': '角色1',
        'logicaldel': 1
      },
      {
        'id': 2,
        'name': '角色2',
        'logicaldel': 1
      },
      {
        'id': 3,
        'name': '角色3',
        'logicaldel': 0
      }
    ]
  }
})

kySecurity.post('/role/add', async function (ctx) {
  const { name, remark, logicaldel, resourceId } = ctx.request.body
  console.log('name: %s, remark: %s, logicaldel: %s', name, remark, logicaldel)
  console.log('resourceId: %s', resourceId)
  ctx.body = {
    message: 'SUCCESS'
  }
})
kySecurity.post('/role/update', async function (ctx) {
  const { id, name, remark, logicaldel, resourceId } = ctx.request.body
  console.log('id: %s, name: %s, remark: %s, logicaldel: %s', id, name, remark, logicaldel)
  console.log('resourceId: %s', resourceId)
  ctx.body = {
    message: 'SUCCESS'
  }
})

kySecurity.get('/operator/findByRole/1', async function (ctx) {
  ctx.body = {
    'endRow': 1,
    'firstPage': 1,
    'hasNextPage': false,
    'hasPreviousPage': false,
    'isFirstPage': true,
    'isLastPage': true,
    'lastPage': 1,
    'list': [
      {
        'authorize': 0,
        'loginId': '1',
        'name': '测试',
        'type': 2
      }
    ],
    'navigateFirstPage': 1,
    'navigateLastPage': 1,
    'navigatePages': 8,
    'navigatepageNums': [
      1
    ],
    'nextPage': 0,
    'pageNum': 1,
    'pageSize': 10,
    'pages': 1,
    'prePage': 0,
    'size': 1,
    'startRow': 1,
    'total': 1
  }
})

kySecurity.post('/role/deleteOperator', async function (ctx) {
  const { roleId, operatorId } = ctx.request.body
  console.log('roleId: %s, operatorId: %s', roleId, operatorId)
  ctx.body = {
    message: 'SUCCESS'
  }
})

kySecurity.post('/role/delete/1', async function (ctx) {
  ctx.body = {
    message: 'SUCCESS'
  }
})
module.exports = kySecurity
