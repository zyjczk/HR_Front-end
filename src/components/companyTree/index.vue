<template>
  <div>
    <div class="tree-wrapper" style="height: 500px; overflow: auto">
      <Tree :data="treeData"  show-checkbox @on-check-change='handleCheckChange' ref="tree" />
    </div>
    <div class="btn-wrapper mt20">
      <Button type="primary" @click="submitAuth">授权</Button>
      <Button type="dashed" @click="goback">返回</Button>
    </div>
  </div>
</template>

<script>
import AuthApi from '@api/auth'
export default {
  data () {
    return {}
  },
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    loginId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    async submitAuth () {
      let nodes = this.$refs.tree.getCheckedNodes()
      let arr = this._dealTreeArray(nodes)
      await this._updateOperatorAuth(arr)
    },
    goback () {
      this.$router.push({
        path: '/authority/',
        query: {
          _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
        }
      })
    },
    handleCheckChange (data) {
      console.log(data)
    },
    _dealTreeArray (data) {
      let arr = []
      data.forEach(item => {
        arr.push(item.code)
      })
      return arr
    },
    async _updateOperatorAuth (arr) {
      let params = {
        loginId: this.loginId,
        type: (+this.type),
        dataResourceId: arr
      }
      let res = await AuthApi.updateOperatorAuth(params)
      if (res === 'success') {
        this.$Message.success('更新成功')
        this.$router.push({
          path: '/authority/',
          query: {
            _time: new Date().getTime() / 1000 // 时间戳，刷新当前router
          }
        })
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
