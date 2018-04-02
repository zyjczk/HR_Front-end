import Vue from 'vue'
import Router from 'vue-router'
import Login from '@page/login'
import Index from '@page/index'
import Layout from '@/components/layout'
import AuthorityUser from '@page/authority/user'
import AuthorityRole from '@page/authority/role'
import SalarySearch from '@page/salary/search/search.vue'
import ReviewDetail from '@page/salary/reviewDetail/reviewDetail.vue'
import SalaryInsert from '@page/salary/insert/insert.vue'
import CompanyTreeAuth from '@page/authority/companytreeauth'
import CompanyTreeShow from '@page/authority/companytreeshow'
import UserRole from '@page/authority/userrole'
import UserAuth from '@page/authority/userauth'
import EditRole from '@page/authority/editrole'
import UserList from '@page/authority/userlist'
import SalaryReviewDetail from '@page/salary/reviewDetail/salaryReviewDetail/salaryReviewDetail.vue'
import SalaryCheckDetail from '@page/salary/reviewDetail/salaryCheckDetail/salaryCheckDetail.vue'
import SearchDetail from '@page/salary/search/searchDetail/searchDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      component: Layout,
      children: [
        {
          path: '/',
          component: Index
        }
      ]
    },
    {
      path: '/salary',
      component: Layout,
      meta: {
        name: '奖金分配'
      },
      children: [
        {
          path: '/',
          component: SalaryInsert,
          meta: {
            name: '奖金录入'
          }
        },
        {
          path: 'salarySearch',
          component: SalarySearch,
          meta: {
            name: '奖金查询'
          },
          children: [
            {
              path: 'searchDetail/:id',
              component: SearchDetail,
              meta: {
                name: '奖金详情'
              }
            }
          ]
        },
        {
          path: 'salaryReview',
          component: ReviewDetail,
          meta: {
            name: '奖金审核列表'
          },
          children: [
            {
              path: 'salaryReviewDetail/:id',
              component: SalaryReviewDetail,
              meta: {
                name: '奖金审核详情'
              }
            },
            {
              path: 'salaryCheckDetail/:id',
              component: SalaryCheckDetail,
              meta: {
                name: '奖金查看详情'
              }
            }
          ]
        }
      ]
    },
    {
      path: '/authority',
      component: Layout,
      meta: {
        name: '权限分配'
      },
      children: [
        {
          path: '/',
          component: AuthorityUser,
          name: '权限分配',
          meta: {
            name: '用户管理'
          },
          children: [
            {
              path: 'companytree_auth/:loginId/:type',
              component: CompanyTreeAuth,
              name: '组织机构授权',
              meta: {
                name: '授权'
              }
            },
            {
              path: 'companytree_show/:loginId/:type',
              component: CompanyTreeShow,
              name: '组织机构查看',
              meta: {
                name: '查看'
              }
            },
            {
              path: 'userrole/:check/:from/:loginId',
              component: UserRole,
              name: '角色'
            },
            {
              path: 'userauth/:roleId',
              component: UserAuth,
              name: '查看功能权限'
            }
          ]
        },
        {
          path: 'role',
          component: AuthorityRole,
          meta: {
            name: '角色管理'
          },
          children: [
            {
              path: 'editRole/:id?',
              component: EditRole,
              name: '编辑角色'
            },
            {
              path: 'userlist/:roleId',
              component: UserList,
              name: '成员列表'
            }
          ]
        }
      ]
    }
  ]
})
