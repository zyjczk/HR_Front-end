import AuthApi from '@api/auth'
export default {
  data () {
    return {
      roleData: []
    }
  },
  methods: {
    async _getAllRole () {
      let res = await AuthApi.getAllRole()
      this.roleData = res.role
    },
    async deleteSuccess () {
      this._getAllRole()
    }
  },
  async mounted () {
    await this._getAllRole()
  },
  watch: {
    '$route': async function (route) {
      let query = route.query
      if (query._time) {
        await this._getAllRole()
      }
    }
  }
}
