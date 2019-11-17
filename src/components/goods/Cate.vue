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
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :selection-type="false"
        :expand-type="false "
        show-index
        index-text="#"
        border
        :data="catelist"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === 'false'"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if=" scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="action" slot-scope>
          <el-button type="primary" icon="icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
      @close="handleAddCateDialogClose"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRefs"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源  props 为配置对象-->
          <el-cascader
            v-model="selectionOptions"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleCascaderChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      // 列定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示 将当前列 自定义为模版类
          type: 'template',
          // 表示当前这一列使用的模版名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示 将当前列 自定义为模版类
          type: 'template',
          // 表示当前这一列使用的模版名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示 将当前列 自定义为模版类
          type: 'template',
          // 表示当前这一列使用的模版名称
          template: 'action'
        }
      ],
      // 添加分类对话框
      addCatedialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id  1级分类为0  不为空
        cat_pid: 0,
        // 分类等级 默认添加为0  一级分类
        cat_level: 0
      },
      // 添加分类 检验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器 选中的值 必须绑定为一个数组
      // 选中的父级分类id数组
      selectionOptions: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 实际选中的值（标示的值）
        value: 'cat_id',
        // 展示的值
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
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
      console.log('catelist', this.catelist)
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      // 获取父级分类
      this.getParentCateList()
      this.addCatedialogVisible = true
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
      // this.parentCateList = []
    },
    // 级联选择器 选择项发生变化
    handleCascaderChange() {
      console.log('selectionOptions', this.selectionOptions)
      // 长度大于0 表示有选中父级分类 反之，则表示未选中
      if (this.selectionOptions.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid = this.selectionOptions[this.selectionOptions.length - 1]
        // 分类 级别
        this.addCateForm.cat_level = this.selectionOptions.length
      } else {
        // 父级分类id
        this.addCateForm.cat_pid = 0
        // 分类 级别
        this.addCateForm.cat_level = 0
      }
    },
    // 监听对话框关闭事件
    handleAddCateDialogClose() {
      this.$refs.addCateFormRefs.resetFields()
      // 重置 级联选择器数据
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.selectionOptions = []
    },
    // 点击按钮 增加新的分类
    async addCate() {
      this.$refs.addCateFormRefs.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('新增分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCatedialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
