<template>
  <el-container class="home-container">
    <!-- el-container 不仅仅是组件名 也是所在元素的类名 -->
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width=" isCollapse ? '64px': '200px '">
        <!-- 侧边栏菜单区 -->
        <!-- 主体 菜单 -->
        <div class="togger-button" @click="handleToggerBtnClick">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409Eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!-- 菜单项 -->
          <!-- 注意点：
            1. 必须为每一个菜单项指定一个唯一的index，这样点击折叠与展开的时候  不会同时进行
            2. index 只接收一个字符串 因此需要拼接一个空字符
          -->
          <el-submenu :index="item.id +''" v-for=" item in menulist" :key="item.id">
            <!-- 一级菜单模版 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 子菜单项 -->
            <el-menu-item
              :index="subItem.id+''"
              v-for=" subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      // 获取列表数据
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    },
    handleToggerBtnClick() {
      // 点击切换菜单按钮
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang ="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.togger-button {
  background-color: #4a5064;
  line-height: 24px;
  font-size: 10px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
