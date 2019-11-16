<template>
  <div>
    <!-- 面包屑 导航器 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <!-- <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
      </el-table>-->
      <!-- 分页 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>-->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      catelist: [],
      // 查询接口数据
      queryInfo: {
        type: 3,
        pagesize: 5,
        pagenum: 1
      },
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(this.catelist)
    }
  }
}
</script>

<style>
</style>
