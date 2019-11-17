<template>
  <div>
    <!-- 面包屑 导航器 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert title="注意： 只允许第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cat_obt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectionOptions"
            :options="catelist"
            :props="cascaderProps"
            @change="handleCascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addAtrrdialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleTagRemove(i,scope.row)"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addAtrrdialogVisible = true"
          >添加属性</el-button>
          <!-- 静态表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleTagRemove(i,scope.row)"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引行 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row.attr_id)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数dialog对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addAtrrdialogVisible"
      width="50%"
      @close="handleClosed"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addAttrForm"
        :rules="addAttrFormRules"
        ref="addAttrFormRefs"
        label-width="100px"
      >
        <el-form-item :label="titleText+':'" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAtrrdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数dialog对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editAtrrdialogVisible"
      width="50%"
      @close="handleEditDialogClosed"
    >
      <!-- 添加表单 -->
      <el-form
        :model="editAttrForm"
        :rules="editAttrFormRules"
        ref="editAttrFormRefs"
        label-width="100px"
      >
        <el-form-item :label="titleText+':'" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAtrrdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选择框 配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择 选中元素
      selectionOptions: [],
      // 被选中的页签
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 控制添加对话框的显示
      addAtrrdialogVisible: false,
      // 添加参数的表单数据对象
      addAttrForm: {
        attr_name: ''
      },
      // 表单验证规则对象
      addAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制 修改对话框的显示
      editAtrrdialogVisible: false,
      // 修改参数的表单 数据对象
      editAttrForm: {},
      // 修改表单验证规则对象
      editAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 如果按钮需要被禁用 则返回true 否则返回false
    isBtnDisabled() {
      if (this.selectionOptions.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateID() {
      if (this.selectionOptions.length === 3) {
        return this.selectionOptions[2]
      }
      return null
    },
    // 标题文本
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    // 获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 当选择项改变时触发
    handleCascaderChange() {
      console.log(this.selectionOptions)
      // 根据商品分类 获取对应的分类参数
      this.getParamsData()
    },
    // tab页点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName)
      // 根据选中的动态或者静态 获取对应的分类参数
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      if (this.selectionOptions.length !== 3) {
        this.selectionOptions = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.selectionOptions)
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        { params: { sel: this.activeName } }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数错误')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加属性
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的值
        item.inputValue = ''
        console.log(item.attr_vals)
      })
      // 拿到接口数据 需要判断是动态属性还是静态的数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框的关闭
    handleClosed() {
      this.$refs.addAttrFormRefs.resetFields()
    },
    // 提交参数
    handleFormSubmit() {
      this.$refs.addAttrFormRefs.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.addAttrForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addAtrrdialogVisible = false
        this.getParamsData()
      })
    },
    // 展示修改的对话框
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editAttrForm = res.data
      console.log(this.editAttrForm)
      this.editAtrrdialogVisible = true
    },
    // 监听修改对话框的关闭
    handleEditDialogClosed() {
      this.$refs.editAttrFormRefs.resetFields()
    },
    // 提交修改表单数据
    handleEditFormSubmit() {
      this.$refs.editAttrFormRefs.validate(async valid => {
        if (!valid) {
          return
        }
        console.log(this.activeName)
        const { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.editAttrForm.attr_id}`,
          {
            attr_name: this.editAttrForm.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getParamsData()
        this.editAtrrdialogVisible = false
      })
    },
    // 根据ID删除参数
    async removeParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(confirmResult)
      // 如果点击确认 返回字符串 confirm
      // 如果点击取消 需要对confirmResult 进行错误处理
      // 处理之后返回 cancle 字符串
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发起请求 删除参数
      const { data: res } = await this.$http.delete(
        `categories/${this.cateID}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    // 新增tag(文本框失去焦点或者按下enter按键)
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 没有return 说明输入了内容 需要做处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrValue(row)
    },
    // 点击按钮 展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 文本框 自动获取焦点
      // $nextTick函数 当页面上元素被重新渲染之后 才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 更新tag标签
    async saveAttrValue(row) {
      // 请求接口 保存数据
      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新标签失败')
      }
      this.$message.success('更新标签成功')
    },
    // 处理标签删除
    handleTagRemove(index, data) {
      console.log(index)
      data.attr_vals.splice(index, 1)
      this.saveAttrValue(data)
    }
  }
}
</script>

<style lang="less" scoped>
.cat_obt {
  margin: 15px 0px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
