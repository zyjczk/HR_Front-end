<template>
  <Breadcrumb :style="{margin: '24px 0'}">
    <BreadcrumbItem to='/index'>首页</BreadcrumbItem>
    <BreadcrumbItem v-for="(bread, index) in breads" :key="index" :to="bread.path">{{bread.name}}</BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
export default {
  data () {
    return {
      breads: []
    }
  },
  methods: {
    _getBreads () {
      const { matched } = this.$route
      let breads = []
      matched.map((items) => {
        let bread = {}
        bread.name = items.meta.name
        bread.path = items.path
        items.meta.name && breads.push(bread)
      })
      return breads
    }
  },
  mounted () {
    this.breads = this._getBreads()
  }
}
</script>

<style>

</style>
