<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区 -->
      <el-form  label-width="0px" :molde="loginForm" class="login_form">
        <!-- 用户名 -->
        <el-form-item >
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item >
          <!-- 不能使用 :model 的写法？ 为什么？ -->
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
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
        username: 'xhb',
        password: '123'
      }

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
