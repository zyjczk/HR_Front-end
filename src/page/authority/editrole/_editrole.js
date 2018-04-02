import AuthApi from '@api/auth'
export default {
  data () {
    return {
      logicaldel: '',
      name: '',
      remark: '',
      authData: {},
      treeData: [],
      originData: []
    }
  },
  methods: {
    async handleSaveRole () {
      if (this.$route.params.id) {
        await this._updateRole()
      } else {
        await this._addRole()
      }
    },
    goback () {
      this.$router.push({
        path: '/authority/role',
        query: {
          _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
        }
      })
    },
    // 根据数据生成树
    data2tree (datas) {
      let dataArray = []
      datas.forEach(function (data) {
        let CATL_PARENT = data.parentId
        if (CATL_PARENT === 0) {
          let title = data.name
          let id = data.id
          let checked = data.checked
          var objTemp = {
            parentId: CATL_PARENT,
            title,
            id,
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
        var CATL_CODEP = dataArrayIndex.id

        for (var i = 0; i < datas.length; i++) {
          var data = datas[i]
          var CATL_PARENT = data.parentId
          if (CATL_PARENT === CATL_CODEP) { // 判断是否为儿子节点
            let title = data.name
            let id = data.id
            let checked = data.checked
            var objTemp = {
              checked,
              parentId: CATL_PARENT,
              title,
              id
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
    },

    // 获取默认角色权限信息
    async _getAuthResource () {
      let res = await AuthApi.getAuthResource()
      this.authData = res.resource
      this.originData = res.resource
      this.treeData = this.data2tree(this.authData)
    },
    // 处理添加角色数据
    _dealRoleParams () {
      let params = {}
      params.name = this.name
      params.remark = this.remark
      params.logicaldel = this.logicaldel === 'off' ? 0 : 1
      params.resourceId = this.$refs.authComponent.sendCheckedData()
      if (this.$route.params.id) {
        params.id = this.$route.params.id
      }
      return params
    },
    // 新增角色
    async _addRole () {
      if (!this.name) {
        return this.$Message.error('请输入角色名称')
      }
      let params = this._dealRoleParams()
      let res = await AuthApi.addRole(params)
      if (res === 'success') {
        this.$Message.success('添加角色成功')
        this.$router.push({
          path: '/authority/role',
          query: {
            _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
          }
        })
      } else {
        this.$Message.error(res)
      }
    },
    // 根据角色Id获取角色信息
    async _getRoleDetail () {
      let id = this.$route.params.id
      let res = await AuthApi.getRoleDetail(id)
      this.name = res.name
      this.remark = res.remark
      this.logicaldel = res.logicaldel ? 'on' : 'off'
      this.originData = res.permissions
      this.treeData = this.data2tree(res.permissions)
      console.log(this.treeData)
    },

    // 修改角色
    async _updateRole () {
      if (!this.name) {
        return this.$Message.error('请输入角色名称')
      }
      let params = this._dealRoleParams()
      let res = await AuthApi.updateRole(params)
      if (res === 'success') {
        this.$Message.success('修改角色成功')
        this.$router.push({
          path: '/authority/role',
          query: {
            _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
          }
        })
      } else {
        this.$Message.error(res)
      }
    }
  },
  async mounted () {
    if (this.$route.params.id) {
      await this._getRoleDetail()
    } else {
      await this._getAuthResource()
    }
  }
}
