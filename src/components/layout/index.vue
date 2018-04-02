<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" :active-name="headerActive" @on-select="selectHeader">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <MenuItem name="salary" v-if="showAuth('bonus')">
                            <Icon type="ios-navigate"></Icon>
                            奖金分配
                        </MenuItem>
                        <MenuItem name="authority" v-if="showAuth('security')">
                            <Icon type="ios-keypad"></Icon>
                            权限分配
                        </MenuItem>
                        <MenuItem name="logOut">
                            <Icon type="log-out"></Icon>
                            退出登录
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu
                      :active-name="siderActive"
                      theme="light"
                      width="auto"
                      :open-names="siderOpen"
                      @on-select="selectSider"
                      ref="sider"
                    >
                        <Submenu name="salary" v-if="showSider === 'showSalary'">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                功能列表
                            </template>
                            <MenuItem name="salary-input" v-if="showAuth('addBonus')">
                                <router-link to="/salary">奖金录入</router-link>
                            </MenuItem>
                            <MenuItem name="salary-query" v-if="showAuth('queryBonus')">
                                <router-link to="/salary/salarySearch">
                                奖金查询
                                </router-link>
                            </MenuItem>
                            <MenuItem name="salary--verify" v-if="showAuth('AuditingBouns')">
                                <router-link to="/salary/salaryReview">奖金审核</router-link>
                            </MenuItem>
                        </Submenu>
                        <Submenu name="authority" v-if="showSider === 'showAuthority'">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                功能列表
                            </template>
                            <MenuItem name="authority-user" v-if="showAuth('operator')">
                              <router-link to="/authority/">用户管理</router-link>
                            </MenuItem>
                            <MenuItem name="authority-role" v-if="showAuth('role')">
                              <router-link to="/authority/role">角色管理</router-link>
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <router-view></router-view>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>

<script>
export default {
  data () {
    return {
      path: '',
      siderOpen: [],
      siderActive: '',
      headerActive: ''
    }
  },
  methods: {
    selectHeader (name) {
      if (name === 'logOut') {
        localStorage.clear()
        this.$router.push('/')
        return
      }
      this.$router.push(`/${name}`)
      this.path = `/${name}`
      this.headerActive = name
      this.siderOpen = [`${name}`]
      this.$nextTick(() => {
        this.$refs.sider.updateOpened()
      })
      if (name === 'authority') {
        this.siderActive = 'authority-user'
      } else if (name === 'salary') {
        this.siderActive = 'salary-input'
      }
      this.$nextTick(() => {
        this.$refs.sider.updateActiveName()
      })
    },
    selectSider (name) {
      console.log(name)
    },
    showAuth (str) {
      if (localStorage.auth.indexOf(str) !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    showSider () {
      if (this.path === '/index') {
        return 'showIndex'
      }
      if (this.path === '/salary') {
        return 'showSalary'
      }
      if (this.path === '/authority') {
        return 'showAuthority'
      }
    }
  },
  mounted () {
    this.path = this.$route.matched[0].path
    this.headerActive = this.path.split('/')[1]
    this.siderOpen = [`${this.path.split('/')[1]}`]
    this.$nextTick(() => {
      this.$refs.sider.updateOpened()
    })
  }
}
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.layout .ivu-layout {
  height: 100%;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.ivu-menu-item a {
  display: block;
  color: #495060;
}
</style>
