import AuthApi from '@api/auth'
export default {
  data () {
    return {
      check: '',
      from: '',
      loginId: '',
      roleData: []
    }
  },
  methods: {
    goback () {
      this.$router.push({
        path: '/authority/',
        query: {
          _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
        }
      })
    },
    async confirm () {
      const { roletableRef } = this.$refs
      let roleId = roletableRef.__getData()
      await this._updateOperatorRole(roleId)
    },
    async _getRoleData () {
      let res = await AuthApi.findOperatorRole(this.loginId)
      this.roleData = res.role
    },
    async _updateOperatorRole (roleId) {
      let res = await AuthApi.updateOperatorRole(this.loginId, roleId)
      if (res === 'success') {
        this.$Message.success('修改成功')
        this.$router.push({
          path: '/authority/',
          query: {
            _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
          }
        })
      }
    }
  },
  async mounted () {
    const { params } = this.$route
    this.roleData = []
    this.check = params.check
    this.from = params.from
    this.loginId = params.loginId
    await this._getRoleData()
  }
}
