// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import Bread from './components/bread'
import CompanyTree from './components/companyTree'
import RoleTable from './components/roleTable'
import AuthComponent from './components/authComponent'
import 'iview/dist/styles/iview.css'
import './style/base.css'
Vue.component('Bread', Bread)
Vue.component('CompanyTree', CompanyTree)
Vue.component('RoleTable', RoleTable)
Vue.component('AuthComponent', AuthComponent)
Vue.use(iview)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
