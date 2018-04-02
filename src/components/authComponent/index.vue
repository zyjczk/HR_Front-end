<template>
  <div class="table-wrapper">
    <h4>配置权限</h4>
    <hr>
    <div style="height: 300px; overflow: auto">
      <CheckboxGroup v-model="checkedAuth">
        <p v-for="item in originData" :key="item.id">
          <Checkbox  :label="item.id">
            <span>{{item.name}}</span>
          </Checkbox>
        </p>
      </CheckboxGroup>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    originData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      checkedAuth: []
    }
  },
  methods: {
    sendCheckedData () {
      // let nodes = this.$refs.authTree.getCheckedNodes()
      // let arr = this._dealTreeArray(nodes)
      console.log(this.checkedAuth)
      return this.checkedAuth
    },
    _dealTreeArray (data) {
      let arr = []
      data.forEach(item => {
        arr.push(item.id)
      })
      return arr
    },
    // 处理原始数据
    _dealOriginData () {
      let arr = []
      if (this.originData.length > 0) {
        this.originData.map(item => {
          if (item.checked === 1) {
            arr.push(item.id)
          }
        })
      }
      this.checkedAuth = arr
    }
  },
  watch: {
    originData () {
      this._dealOriginData()
    }
  },
  mounted () {
    this._dealOriginData()
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  width: inherit;
  max-width: 100%;
  overflow: hidden;
  color: #495060;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
  table {
    display: table;
    border-color: grey;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th, td {
    padding: 15px;
    border-right: 1px solid #e9eaec;
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #e9eaec;
  }
  th {
    border-right: 1px solid #e9eaec;
    border-top: 1px solid #e9eaec;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
  }
  table {
    border-left: 1px solid #e9eaec;
  }
  td {
    padding: 0 20px
  }
}
</style>
