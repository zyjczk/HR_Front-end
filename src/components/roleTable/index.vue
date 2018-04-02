<template>
  <div class="roleTable-wrapper">
    <div class="search-wrapper">
      <div class="search">
        <Input placeholder="请输入角色名称" />
      </div>
      <Button type="primary">查询</Button>
      <Button type="primary" v-if="showAuth('addRole') && (from === 'role')" @click="handleAddRole">添加角色</Button>
    </div>
    <Table border :columns="col" :data="roleData"></Table>
    <Modal v-model="deleteModal" title="删除角色提示" @on-ok="confirmDeleteUser">
      <h3>该角色删除后，与之关联的所有用户将失去该角色拥有的功能权限，是否确认删除？</h3>
    </Modal>
  </div>
  </div>
</template>

<script>
import AuthApi from '@api/auth'
export default {
  data () {
    return {
      chooseId: '',
      deleteModal: false,
      defaultcolumns: [
        {
          title: '请选择',
          key: 'choose',
          render: (h, params) => {
            if (params.row.checked) {
              this.chooseId = params.row.id
            }
            return h('input', {
              attrs: {
                type: 'radio',
                name: 'role',
                checked: params.row.checked || false,
                value: params.row.id
              },
              on: {
                click: (e) => {
                  console.log(e)
                  if (e.target.checked) {
                    this.chooseId = e.target.value
                  }
                }
              }
            })
          }
        },
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '状态',
          render: (h, params) => {
            let text = params.row.logicaldel ? '无效' : '有效'
            return h('span', text)
          }
        },
        {
          title: '功能权限',
          key: 'btn',
          render: (h, params) => {
            console.log(params)
            return h('Button', {
              props: {
                type: 'dashed'
              },
              on: {
                click: () => {
                  this.$router.push(`/authority/userauth/${params.row.id}`)
                }
              }
            }, '查看')
          }
        }
      ],
      columns: [
        {
          title: '角色名称',
          key: 'name'
        },
        {
          title: '状态',
          render: (h, params) => {
            let text = params.row.logicaldel ? '无效' : '有效'
            return h('span', text)
          }
        },
        {
          title: '成员列表',
          key: 'number',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'dashed',
                size: 'small'
              },
              on: {
                click: () => {
                  this.$router.push(`/authority/role/userlist/${params.row.id}`)
                }
              }
            }, '查看')
          }
        },
        {
          title: '操作',
          key: 'btn',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'dashed',
                  size: 'small'
                },
                on: {
                  click: () => {
                    if (localStorage.auth.indexOf('updateRole') !== -1) {
                      this.$router.push(`/authority/role/editRole/${params.row.id}`)
                    } else {
                      this.$Message.error('用户无操作权限')
                    }
                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'dashed',
                  size: 'small'
                },
                on: {
                  click: () => {
                    if (localStorage.auth.indexOf('deleteRole') !== -1) {
                      this.roleId = params.row.id
                      this.deleteModal = true
                    } else {
                      this.$Message.error('用户无操作权限')
                    }
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      roleId: ''
    }
  },
  props: {
    from: {// 判断从哪个模块来决定使用哪个表头
      type: String,
      default: 'user'
    },
    check: {// 根据check判断是否禁用按钮 show禁用 allot不禁用
      tpye: String,
      default: 'allot'
    },
    roleData: {// 传入的渲染数据
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    col () {
      if (this.from === 'user') {
        return this.defaultcolumns
      }

      if (this.from === 'role') {
        return this.columns
      }

      return []
    }
  },
  mounted () {
    console.log(this.roleData)
  },
  methods: {
    // 暴露给外部使用的方法
    __getData () {
      return this.chooseId
    },
    async confirmDeleteUser () {
      await this._deleteRole()
    },
    handleAddRole () {
      this.$router.push('/authority/role/EditRole')
    },
    async _deleteRole () {
      let res = await AuthApi.deleteRole(this.roleId)
      if (res === 'success') {
        this.$Message.success('删除成功')
        this.$emit('deleteSuccess')
      }
    },
    showAuth (str) {
      if (localStorage.auth.indexOf(str) !== -1) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  width: 100%;
  margin-bottom: 20px;
  .search {
    width: 50%;
    display: inline-block;
  }
}
</style>
