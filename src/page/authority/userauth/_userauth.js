import AuthApi from '@api/auth'
export default {
  data () {
    return {
      roleId: '',
      name: '',
      remark: '',
      logicaldel: '',
      authData: {}
    }
  },
  async mounted () {
    this.roleId = this.$route.params.roleId
    await this._getRoleDetail()
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    async _getRoleDetail () {
      let res = await AuthApi.getRoleDetail(this.roleId)
      this.name = res.name
      this.remark = res.remark
      this.logicaldel = res.logicaldel ? '无效' : '有效'
      this.authData = res.resources
    }
  }
}
