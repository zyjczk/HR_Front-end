import AuthApi from '@api/auth'
import $ from 'jquery'
import 'ztree/css/zTreeStyle/zTreeStyle.css'
import 'ztree'

export default {
  data () {
    return {
      testNodeData: [
        {
          name: '父节点1',
          children: [
            {
              name: '子节点1'
            },
            {
              name: '子节点2'
            }
          ]
        }
      ],
      setting: {
        view: {
          showLine: false
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          onClick: this.getFileDesc
        }
      },
      isAdmin: true,
      selection: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '工号',
          key: 'loginId'
        },
        {
          title: '员工姓名',
          key: 'name'
        },
        {
          title: '级别',
          key: ' type',
          render: (h, params) => {
            console.log(params.row.type, typeof params.row.type)
            return h('div', [
              h(
                'span',
                {
                  props: {
                    type: 'dashed',
                    size: 'small'
                  }
                },
                params.row.type === 1 ? '总部' : '网点'
              )
            ])
          }
        },
        {
          title: '数据权限',
          key: 'type',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'dashed',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      if (localStorage.auth.indexOf('dataResource') !== -1) {
                        this.$router.push(
                          `/authority/companytree_auth/${params.row.loginId}/2`
                        )
                      } else {
                        this.$Message.error('暂无操作权限')
                      }
                    }
                  }
                },
                '奖金录入'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'dashed',
                    size: 'small'
                  },
                  style: {
                    'margin-left': '20px'
                  },
                  on: {
                    click: () => {
                      if (localStorage.auth.indexOf('dataResource') !== -1) {
                        this.$router.push(
                          `/authority/companytree_show/${params.row.loginId}/1`
                        )
                      } else {
                        this.$Message.error('暂无操作权限')
                      }
                    }
                  }
                },
                '奖金查询'
              )
            ])
          }
        },
        {
          title: '对应角色',
          key: 'roleName',
          render: (h, params) => {
            let showText = params.row.roleName || '去分配'
            return h(
              'Button',
              {
                props: {
                  type: 'dashed',
                  size: 'small'
                },
                on: {
                  click: () => {
                    if (localStorage.auth.indexOf('operatorRole') !== -1) {
                      if (showText === '去分配') {
                        this.$router.push(
                          `/authority/userrole/allot/user/${params.row.loginId}`
                        )
                      } else {
                        this.$router.push(
                          `/authority/userrole/show/user/${params.row.loginId}`
                        )
                      }
                    } else {
                      this.$Message.error('暂无操作权限')
                    }
                  }
                }
              },
              showText
            )
          }
        }
      ],
      data: [],
      modalFlag: false,
      level: '',
      levelList: [
        {
          value: '1',
          label: '总部'
        },
        {
          value: '2',
          label: '网点'
        }
      ],
      page: 1,
      total: 100,
      deleteModal: false,
      userModal: false,
      userColumns: [
        {
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('input', {
              attrs: {
                type: 'checkbox'
              },
              on: {
                click: e => {
                  let checked = e.target.checked
                  if (checked) {
                    this.userCheckedLoginId = params.row.loginId
                    this.userCheckedName = params.row.lastName
                  } else {
                    this.userCheckedLoginId = ''
                    this.userCheckedName = ''
                    this.userCheckedType = 2
                  }
                }
              }
            })
          }
        },
        {
          title: '工号',
          key: 'loginId'
        },
        {
          title: '员工姓名',
          key: 'lastName'
        },
        {
          title: '级别',
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: this.userCheckedType
                },
                on: {
                  'on-change': e => {
                    this.userCheckedType = e
                  }
                }
              },
              [
                h('Option', {
                  props: {
                    value: 1,
                    label: '总部'
                  }
                }),
                h('Option', {
                  props: {
                    value: 2,
                    label: '网点'
                  }
                })
              ]
            )
          }
        }
      ],
      userCheckedLoginId: '',
      userCheckedName: '',
      userCheckedType: 2,
      userData: [],
      userId: '',
      adminform: {
        name: 'admin',
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      },
      formSearch: {
        loginId: '',
        name: '',
        authorize: ''
      }
    }
  },
  methods: {
    showAuth (str) {
      if (localStorage.auth.indexOf(str) !== -1) {
        return true
      } else {
        return false
      }
    },
    // 搜索
    async handleSearch () {
      await this._getOperator()
    },
    // 批量删除
    batchDeleteUser () {
      this.deleteModal = true
    },
    // 确认删除所选用户
    async confirmDeleteUser () {
      await this._deleteOperator()
      await this._getOperator()
    },
    // 添加用户
    addUser () {
      this.userModal = true
    },
    // 搜索用户
    async searchUser () {
      await this._getOAUserByLoginId()
    },
    // 关闭新增用户模态框，重置相关数据
    cancelAddUser () {
      this._resetUserData()
    },
    // 确认添加用户
    async confirmAddUser () {
      await this._addOperator()
    },
    selectChange (selection) {
      this.selection = selection
    },
    // 分页
    async pageChange (page) {
      this.page = page
      await this._getOperator()
    },
    // 更改超级管理员密码
    async handleChangeAdmin () {
      await this._updateAdminPassword()
    },

    // 处理选择的操作员数据
    _dealSelection () {
      let loginId = []
      this.selection.forEach(item => {
        loginId.push(item.loginId)
      })
      return loginId
    },

    // 重置模态框数据
    _resetUserData () {
      this.userCheckedLoginId = ''
      this.userCheckedName = ''
      this.userCheckedType = 2
      this.userData = []
      this.userId = ''
    },
    // 获取所有操作员
    async _getOperator () {
      let pageNum = this.page
      let pageSize = 10
      let loginId = this.formSearch.loginId || ''
      let name = this.formSearch.name || ''
      let authorize = this.formSearch.authorize
      if (authorize === 'all') {
        authorize = ''
      }
      let params = {
        pageNum,
        pageSize,
        loginId,
        name,
        authorize
      }
      const res = await AuthApi.getOperator(params)
      this.data = res.list
      this.total = res.total
    },
    // 删除操作员
    async _deleteOperator () {
      let params = {}
      params.loginId = this._dealSelection()
      const res = await AuthApi.deleteOperator(params)
      res === 'success'
        ? this.$Message.success('删除成功')
        : this.$Message.error('删除失败')
    },
    // 根据loginId获取OA信息
    async _getOAUserByLoginId () {
      let loginId = this.userId
      if (!loginId) {
        return this.$Message.error('请输入员工工号')
      }
      let res = await AuthApi.getOAUserByLoginId(loginId)
      this.userData = res.OAUser
    },
    // 添加操作员
    async _addOperator () {
      let loginId = this.userCheckedLoginId
      let name = this.userCheckedName
      let type = this.userCheckedType
      if (!loginId) {
        return this.$Message.error('请选择要添加的员工')
      }
      let res = await AuthApi.addOperator({ loginId, name, type })
      if (res === 'success') {
        this.$Message.success('添加成功')
        this._resetUserData()
        await this._getOperator()
      }
    },

    // 修改admin密码
    async _updateAdminPassword () {
      let params = {}
      params.password = this.adminform.oldPassword
      params.newPassword = this.adminform.newPassword
      params.newPassword1 = this.adminform.reNewPassword
      let res = await AuthApi.updateAdminPassword(params)
      if (res === 'success') {
        this.$Message.success('更改成功')
      } else {
        this.$Message.error(res)
      }
      this.adminform.oldPassword = ''
      this.adminform.newPassword = ''
      this.adminform.reNewPassword = ''
    },
    // 修改员工级别 又放弃了
    async modifyLevel () {
      // let params = {}
      // let res = await AuthApi.updateAdminPassword(params)
      console.log(123)
    }
  },
  computed: {
    disabledDeleteBtn () {
      return !(this.selection.length > 0)
    }
  },
  async mounted () {
    await this._getOperator()
    let nodeData = this.testNodeData
    $.fn.zTree.init($('#uploadtree'), this.setting, nodeData)
  },
  watch: {
    $route: async function (route) {
      let query = route.query
      if (query._time) {
        await this._getOperator()
      }
    }
  }
}
