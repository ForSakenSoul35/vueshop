<template>
  <div>
    <!-- 面包屑 导航器 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条组件 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tabs -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品信息" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="catelist"
                :props="cascaderProps"
                @change="handleCascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manytablelist" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 获取对应的静态属性 -->
            <el-form-item :label="item.attr_name" v-for="item in onlytablelist" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传到的api接口 -->
            <!-- on-preview 指定预览的接口 -->
            <!--  on-remove 处理移除-->
            <!-- list-type 展示图片显示的效果 文件，预览图或者其他的 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handSuccessUpload"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="imgUrl" alt="预览图片" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品表单数据
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情
        goods_introduce: ''
      },
      // 表单规则验证对象
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      catelist: [],
      // 级联选择器配置对象
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      manytablelist: [],
      // 静态属性列表
      onlytablelist: [],
      // 图片上传组件的header 请求头对象
      // 因为上传组件 不是通过axios 发起请求的
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的url
      imgUrl: '',
      // 图片预览的Dialog
      imgDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    // 级联选择器选择项变化
    handleCascaderChange() {
      console.log(this.addGoodsForm.goods_cat)
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 监听标签页离开
    // 函数返回false 即不允许进行切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // tab被点击时触发
    async tabClicked() {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        // 访问的是动态参数面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        console.log(res.data)
        // 遍历 将item.attr_vals 从字符串转化为数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manytablelist = res.data
      }
      if (this.activeIndex === '2') {
        // 访问的是静态是属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败')
        }
        console.log(res.data)
        // 遍历 将item.attr_vals 从字符串转化为数组
        // res.data.forEach(item => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        // })
        this.onlytablelist = res.data
      }
    },
    // 图片预览时的操作
    handlePreview(file) {
      this.imgUrl = file.response.data.url
      this.imgDialogVisible = true
    },
    // 图片移除的操作
    handleRemove(file) {
      console.log(file)
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 找到图片对应的索引值
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      // 删除
      this.addGoodsForm.pics.splice(i, 1)
    },
    // 文件上传成功之后
    handSuccessUpload(response) {
      console.log(response)
      if (response.meta.status !== 200) {
        return
      }
      let picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm.pics)
    },
    add() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行表单提交
        // 对addGoodsForm进行深拷贝(使用lodash)
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理attrs数组，数组中需要包含商品的动态参数和静态属性
        // 将manytablelist（动态参数）处理添加到attrs
        this.manytablelist.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        // 将oonlytablelist（静态属性）处理添加到attrs
        this.onlytablelist.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
