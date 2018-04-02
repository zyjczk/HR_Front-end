import AuthApi from '@api/auth'
export default {
  data () {
    return {
      loginId: '',
      type: '',
      tree: []
    }
  },
  methods: {
    async _getOperatorShowAuth () {
      let res = await AuthApi.getOperatorShowAuth({ loginId: this.loginId, type: this.type })
      res.department[0].parentCode = null
      this.data = res.department
      this.tree = this.data2tree(this.data)
    },
    // 根据数据生成树
    data2tree (datas) {
      let dataArray = []
      datas.forEach(function (data) {
        let CATL_PARENT = data.parentCode
        if (CATL_PARENT === null) {
          let title = data.name
          let code = data.code
          let checked = data.checked
          var objTemp = {
            parentCode: CATL_PARENT,
            title,
            code,
            checked,
            selected: true,
            expand: true
          }
          dataArray.push(objTemp)
        }
      })
      return this.data2treeDG(datas, dataArray)
    },
    data2treeDG (datas, dataArray) {
      for (var j = 0; j < dataArray.length; j++) {
        var dataArrayIndex = dataArray[j]
        var childrenArray = []
        var CATL_CODEP = dataArrayIndex.code

        for (var i = 0; i < datas.length; i++) {
          var data = datas[i]
          var CATL_PARENT = data.parentCode
          if (CATL_PARENT === CATL_CODEP) { // 判断是否为儿子节点
            let title = data.name
            let code = data.code
            let checked = data.checked
            var objTemp = {
              checked,
              parentCode: CATL_PARENT,
              title,
              code
            }
            childrenArray.push(objTemp)
          }
        }
        dataArrayIndex.children = childrenArray
        if (childrenArray.length > 0) { // 有儿子节点则递归
          this.data2treeDG(datas, childrenArray)
        }
      }
      return dataArray
    }
  },
  async mounted () {
    this.loginId = this.$route.params.loginId
    this.type = this.$route.params.type
    await this._getOperatorShowAuth()
  }
}
