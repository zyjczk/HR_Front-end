<template>
  <div class="login-box-wrapper">
    <div class="login-box">
      <div class="login-box-header">
        <!-- <h1>欢迎登录开元金融工资系统</h1> -->
        <h1>开元金融</h1><h3>工资系统</h3>
      </div>
      <div class="login-box-contaniner">
        <Form ref="formdata" :model="formdata" :rules="ruleInline">
          <FormItem prop="username">
            <Input type="text" v-model="formdata.username" placeholder="请输入用户名">
              <Icon type="person" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formdata.password" placeholder="请输入密码">
              <Icon type="locked" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button class="logo" type="primary" @click="handleSubmit('formdata')">登录</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import AuthApi from '@api/auth'
const SUCCESS_CODE = 200
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      },
      ruleInline: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码至少六位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let res = await AuthApi.login(this.formdata)

          if (res.status === SUCCESS_CODE) {
            localStorage.setItem('token', res.result)
            localStorage.setItem('type', res.type)
            localStorage.setItem('name', res.name)
            let auth = await AuthApi.getOperatorFunc()
            localStorage.setItem('auth', auth.resource)
            // console.log(auth.resource)
            if (auth.resource.length > 0) {
              this.$router.push('/index')
              await AuthApi.refreshToken()
            } else {
              this.$Message.error('您暂无访问权限，请联系管理员')
            }
          } else {
            this.$Message.error(res.message)
          }
        } else {
          this.$Message.error('请输入正确的用户名和密码')
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .login-box-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("./bg.png");
    .login-box {
      width: 400px;
      button {
        width: 100%;
      }
      .login-box-header {
        text-align: center;
        background: #324858;
        padding: 10px 0;
        border-radius: 5px;
        h1 {
          color:#fff;
          display: inline-block;
        }
        h3{
          margin-left: 5px;
          display: inline-block;
          color:#ccc
        }
      }
      .login-box-contaniner {
        padding:20px;
        background: #fff;
        .logo{
          float:right;
          width:30%
        }
      }
    }
  }
</style>
