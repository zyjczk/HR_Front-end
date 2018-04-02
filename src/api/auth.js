import axios from './api'

/**
 * 配置请求路径与方法
 */
const AuthUrl = {
  login: { // 登录接口
    url: '/kySecurity/login',
    method: 'POST'
  },
  refreshToken: { // 刷新token接口
    url: '/kySecurity/refreshToken',
    method: 'GET'
  },
  getOperator: { // 获取所有操作员接口
    url: '/kySecurity/operator/all',
    method: 'GET'
  },
  getOperatorFunc: { // 获取当前用户的菜单和功能
    url: '/kySecurity/operator/resource',
    method: 'GET'
  },
  deleteOperator: { // 删除所选操作人员
    url: '/kySecurity/operator/delete',
    method: 'POST'
  },
  updateAdminPassword: { // 更改管理员密码
    url: '/kySecurity/operator/updateAdminPassword',
    method: 'POST'
  },
  getOAUserByLoginId: { // 获取用户OA信息
    url: '/kySecurity/OA/getOAUserByLoginId/',
    method: 'GET'
  },
  addOperator: { // 添加操作员
    url: '/kySecurity/operator/add',
    method: 'POST'
  },
  getOperatorShowAuth: { // 查看操作员的录入查看权限
    url: '/kySecurity/dataResource/findByOperator',
    method: 'GET'
  },
  updateOperatorAuth: { // 修改操作员的录入查看权限
    url: '/kySecurity/dataResource/updateByOperator',
    method: 'POST'
  },
  findOperatorRole: { // 查看操作人员角色
    url: '/kySecurity/role/findByOperator/',
    method: 'GET'
  },
  updateOperatorRole: { // 修改操作员的角色
    url: '/kySecurity/role/updateByOperator',
    method: 'POST'
  },
  getRoleDetail: { // 查询角色信息
    url: '/kySecurity/role/get/',
    method: 'GET'
  },
  getAuthResource: { // 查询权限列表
    url: '/kySecurity/role/getResource',
    method: 'GET'
  },
  getAllRole: { // 获取所有角色列表
    url: '/kySecurity/role/all',
    method: 'GET'
  },
  addRole: { // 添加角色
    url: '/kySecurity/role/add',
    method: 'POST'
  },
  updateRole: { // 修改角色
    url: '/kySecurity/role/update',
    method: 'POST'
  },
  findUserByRole: { // 获取角色对应的成员列表
    url: '/kySecurity/operator/findByRole/',
    method: 'GET'
  },
  deleteRoleOperator: { // 删除角色里的操作员
    url: '/kySecurity/role/deleteOperator',
    method: 'POST'
  },
  deleteRole: { // 删除角色
    url: '/kySecurity/role/delete/',
    method: 'POST'
  }
}

// 刷新token间隔时间
const REFRESH_TIME = 30 * 60 * 1000

// 返回成功Code
const SUCCESS_CODE = 200

const AuthApi = {
  // 登录接口
  login: async ({ username, password }) => {
    let res = await axios({
      method: AuthUrl.login.method,
      url: AuthUrl.login.url,
      data: { username, password }
    })
    return res.data
  },
  // 刷新token
  refreshToken: () => {
    setInterval(async () => {
      let res = await axios({
        url: AuthUrl.refreshToken.url,
        method: AuthUrl.refreshToken.method
      })
      if (res.data.status === SUCCESS_CODE) {
        localStorage.setItem('token', res.data.result)
        localStorage.setItem('type', res.data.type)
        localStorage.setItem('name', res.data.name)
      }
    }, REFRESH_TIME)
  },
  // 获取用户列表
  getOperator: async (params) => {
    let url = `${AuthUrl.getOperator.url}?loginId=${params.loginId}&name=${params.name}&authorize=${params.authorize}
    &pageNum=${params.pageNum}&pageSize=${params.pageSize}`
    let res = await axios({
      url: url,
      method: AuthUrl.getOperator.method
    })
    return res.data
  },

  // 更改管理员密码
  updateAdminPassword: async (params) => {
    let url = `${AuthUrl.updateAdminPassword.url}?password=${params.password}&newPassword=${params.newPassword}&newPassword1=${params.newPassword1}`
    let res = await axios({
      url,
      method: AuthUrl.updateAdminPassword.method
    })
    return res.data
  },

  // 获取当前用户的菜单和功能
  getOperatorFunc: async () => {
    let res = await axios({
      url: AuthUrl.getOperatorFunc.url,
      method: AuthUrl.getOperatorFunc.method
    })
    return res.data
  },

  // 删除操作员
  deleteOperator: async (params) => {
    let res = await axios({
      url: AuthUrl.deleteOperator.url,
      method: AuthUrl.deleteOperator.method,
      data: { loginId: params.loginId }
    })
    return res.data
  },

  // 根据工号查询用户对应OA信息
  getOAUserByLoginId: async (loginId) => {
    let res = await axios({
      url: AuthUrl.getOAUserByLoginId.url + loginId,
      method: AuthUrl.getOAUserByLoginId.method
    })
    return res.data
  },

  // 新增操作员
  addOperator: async (params) => {
    let obj = {}
    obj.name = params.name
    obj.type = params.type
    obj.loginId = params.loginId
    let res = await axios({
      url: `${AuthUrl.addOperator.url}?name=${obj.name}&type=${obj.type}&loginId=${obj.loginId}`,
      method: AuthUrl.addOperator.method,
      data: obj
    })
    return res.data
  },

  // 查看操作员的 录入/查看 权限
  getOperatorShowAuth: async (params) => {
    let res = await axios({
      url: `${AuthUrl.getOperatorShowAuth.url}?loginId=${params.loginId}&type=${params.type}`,
      method: AuthUrl.getOperatorShowAuth.method
    })
    return res.data
  },
  updateOperatorAuth: async (params) => {
    let res = await axios({
      url: AuthUrl.updateOperatorAuth.url,
      method: AuthUrl.updateOperatorAuth.method,
      data: params
    })
    return res.data
  },
  // 获取操作员角色
  findOperatorRole: async (loginId) => {
    let res = await axios({
      url: AuthUrl.findOperatorRole.url + loginId,
      method: AuthUrl.findOperatorRole.method
    })
    return res.data
  },

  // 修改操作人员角色
  updateOperatorRole: async (loginId, roleId) => {
    let res = await axios({
      url: `${AuthUrl.updateOperatorRole.url}?loginId=${loginId}&roleId=${roleId}`,
      method: AuthUrl.updateOperatorRole.method
    })
    return res.data
  },

  // 查询角色信息
  getRoleDetail: async (roleId) => {
    let res = await axios({
      url: AuthUrl.getRoleDetail.url + roleId,
      method: AuthUrl.getRoleDetail.method
    })
    return res.data
  },

  // 查询权限列表
  getAuthResource: async () => {
    let res = await axios({
      url: AuthUrl.getAuthResource.url,
      method: AuthUrl.getAuthResource.method
    })
    return res.data
  },

  // 获取所有角色列表
  getAllRole: async () => {
    let res = await axios({
      url: AuthUrl.getAllRole.url,
      method: AuthUrl.getAllRole.method
    })
    return res.data
  },
  // 添加角色
  addRole: async (params) => {
    let res = await axios({
      url: AuthUrl.addRole.url,
      method: AuthUrl.addRole.method,
      data: params
    })
    return res.data
  },

  // 修改角色
  updateRole: async (params) => {
    let res = await axios({
      url: AuthUrl.updateRole.url,
      method: AuthUrl.updateRole.method,
      data: params
    })
    return res.data
  },

  // 获取角色对应的成员列表
  findUserByRole: async (params) => {
    let url = AuthUrl.findUserByRole.url + params.roleId + '?pageSize=10'
    if (params.loginId) {
      url += ('&loginId=' + params.loginId)
    }
    if (params.name) {
      url += ('&name=' + params.name)
    }
    url += ('&pageNum=' + params.pageNum || 1)
    let res = await axios({
      url,
      method: AuthUrl.findUserByRole.method
    })
    return res.data
  },
  // 删除角色里的操作员
  deleteRoleOperator: async (params) => {
    let res = await axios({
      url: AuthUrl.deleteRoleOperator.url,
      method: AuthUrl.deleteRoleOperator.method,
      data: params
    })
    return res.data
  },

  // 删除角色
  deleteRole: async (roleId) => {
    let res = await axios({
      url: AuthUrl.deleteRole.url + roleId,
      method: AuthUrl.deleteRole.method
    })
    return res.data
  }
}

export default AuthApi
