<template>
  <div style="height: 100%">
    <Bread />
    <Content :style="{padding: '24px', height: '90%', background: '#fff'}">
      <h1>欢迎  {{name}}  来到奖金管理系统</h1>
    </Content>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: localStorage.getItem('name')
    }
  }
}
</script>
<style>

</style>
