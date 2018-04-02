import AuthApi from '@api/auth'
export default {
  data () {
    return {
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
          title: '操作',
          key: 'edit',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'dashed',
                size: 'small'
              },
              on: {
                click: () => {
                  this.deleteItem = [{loginId: params.row.loginId}]
                  this.deleteModal = true
                }
              }
            }, '删除')
          }
        }
      ],
      data: [],
      deleteSingal: [],
      deleteModal: false,
      deleteItem: [],
      formSearch: {
        loginId: '',
        name: ''
      },
      pageNum: 1,
      total: 0
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
    async handleSearch () {
      await this._getUserList()
    },
    selectItemChange (selectItem) {
      this.deleteItem = selectItem
    },
    // 打开批量删除模态框
    batchDelete () {
      this.deleteModal = true
    },
    // 批量删除
    async confirmDeleteUser () {
      await this._deleteRoleOperator()
    },
    async pageChange (pageNum) {
      this.pageNum = pageNum
      await this._getUserList()
    },
    goback () {
      this.$router.push({
        path: '/authority/role',
        query: {
          _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
        }
      })
    },
    // 更具参数获取成员列表
    async _getUserList () {
      let params = {}
      params.roleId = this.$route.params.roleId
      params.loginId = this.formSearch.loginId
      params.name = this.formSearch.name
      params.pageNum = this.pageNum
      let res = await AuthApi.findUserByRole(params)
      this.total = res.total
      this.data = res.list || []
    },
    async _deleteRoleOperator () {
      let params = {}
      params.roleId = (+this.$route.params.roleId)
      params.operatorId = this._dealSelectItem()
      let res = await AuthApi.deleteRoleOperator(params)
      if (res === 'success') {
        this.$Message.success('删除成功')
        await this._getUserList()
      }
    },
    _dealSelectItem () {
      let operatorId = []
      if (this.deleteItem.length > 0) {
        this.deleteItem.forEach(item => {
          operatorId.push(item.loginId)
        })
      }
      return operatorId
    }
  },
  async mounted () {
    await this._getUserList()
  }
}
