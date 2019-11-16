<template>
  <div>
    <!-- 面包屑 导航器 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-row>
        <el-table :data="rolelist" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                :class="['bd_tottom',i1 === 0 ? 'bd_top': '','vcenter']"
                v-for="(item1,i1) in scope.row.children"
                :key="item1.id"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="handleRightDelete(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级/三级权限 -->
                <el-col :span="19">
                  <!--  通过for循环渲染 二级权限 -->
                  <el-row
                    :class="[i2 === 0 ? '' : 'bd_top','vcenter']"
                    v-for=" (item2,i2) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="handleRightDelete(scope.row,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        closable
                        @close="handleRightDelete(scope.row,item3.id)"
                        :class="[i3 === 0 ? '' : 'bd_top']"
                        v-for=" (item3,i3) in item2.children"
                        :key="item3.id"
                        type="warning"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树型控件 -->
      <el-tree
        :data="rightlist"
        :props="rightProps"
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        show-checkbox
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRightAddClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配对话框的显示和隐藏
      setRightdialogVisible: false,
      rightlist: [],
      // 树形控件 属性绑定事件
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id数组 已有权限默认选中功能
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    // 根据id删除对应的权限
    async handleRightDelete(role, rightid) {
      // 弹框提示是否操作
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // this.getRoleList() 有疑问
      /**
       * 重新发起请求 会触发表格重新渲染 就会将打开状态重置
       * 但是可以重新直接修改 role吗？
       */
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightlist = res.data
      console.log(this.rightlist)
      this.getLeafKeys(role, this.defKeys)
      this.setRightdialogVisible = true
    },
    handleRightChange() {},
    getLeafKeys(node, arr) {
      // 通过递归的形式  获取到三级权限的所有id 并保存
      // 是否是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 不是三级节点
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色权限添加角色
    async handleRightAddClick() {
      // id数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd_top {
  border-top: 1px solid #eee;
}
.bd_tottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
