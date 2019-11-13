<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区 -->
      <el-form  ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- 不能使用 :model 的写法？ 为什么？ -->
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="info" @click="handleResetBtn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        // 表单验证规则对象
        // 验证用户名
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 点击重置按钮
    handleResetBtn () {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    handleLogin () {
      this.$refs.loginFormRef.validate(valid => {
        console.log(valid)
        if(!valid) return 
        // 
        const result = this.$http.post('login',this.loginForm)
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  //  使整个盒子居中
  position: absolute;
  // 相对整个页面
  left: 50%;
  top: 50%;
  // 相对自身;
  transform: translate(-50%,-50%);
  .avatar_box {
    height:130px;
    width:130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img {
      border-radius: 50%;
      width:100%;
      height:100%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width:100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
