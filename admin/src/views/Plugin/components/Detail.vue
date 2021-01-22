<!--suppress ALL -->
<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" style="padding-right:20px;">
      <el-form-item label="插件名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="30" clearable style="width:250px;"/>
      </el-form-item>
      <el-form-item label="插件标识" prop="identify">
        <el-input v-model="ruleForm.identify" maxlength="30" clearable style="width:250px;"/>
      </el-form-item>
      <el-form-item label="插件图标" prop="icon" style="width:300px;">
        <el-input v-model="ruleForm.icon" clearable/>
        <div v-if="ruleForm.icon">
          <svg-icon :icon-class="ruleForm.icon" />
        </div>
      </el-form-item>
      <el-form-item label="插件描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" maxlength="30" clearable style="width:250px;"/>
      </el-form-item>
      <el-form-item v-if="ruleForm.type != 3" label="组件权限">
        <el-table
          :data="ruleForm.element_rule"
          border
          style="width: 100%">
          <el-table-column
            prop="title"
            label="权限名称">
            <template slot-scope="scope">
              <div class="drawing">
                <el-input v-model="scope.row.title" maxlength="30" clearable/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="api"
            label="权限标识">
            <template slot-scope="scope">
              <div class="drawing">
                <el-input v-model="scope.row.api" maxlength="60" clearable/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="icon"
            label="权限图标">
            <template slot-scope="scope">
              <div class="drawing">
                <el-input v-model="scope.row.icon" maxlength="20" clearable/>
                <div v-if="scope.row.icon">
                  <svg-icon :icon-class="scope.row.icon" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="menu"
            label="导航状态">
            <template slot-scope="scope">
              <div class="drawing">
                <el-switch
                  v-model="scope.row.menu"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序">
            <template slot-scope="scope">
              <div class="drawing">
                <el-input v-model="scope.row.sort" maxlength="11" clearable/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="drawing">
                <el-button type="danger" icon="el-icon-delete" circle @click="deleteRule(scope.$index)"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if="ruleForm.type != 3">
        <el-button type="primary" round @click="addRule">添加组件权限</el-button>
        <div class="tip">
          <p>1.组件权限默认会生成查看、添加、编辑、删除几个权限，请根据实现需求进行填写</p>
          <p>2.权限标识统计为首字母大字驼峰命名法（组件标识+操作名）</p>
          <p>3.首次创建组件，将自动生成控制器、模型、VUE模板及相应的权限，如需删除，请手动删除对应文件(请注意，仅本地开发环境使用，服务端前端已打包，将会报错)</p>
          <p>4.组件权限名称和权限标识全网唯一</p>
          <p>5.“导航状态”为“租户端”显示的导航，故默认只有查看是显示状态</p>
          <p>6.“权限图标”为“租户端”显示的导航时的图标</p>
          <p>7.权限请不要随意删除，除非其它地方已经不再有此关联权限</p>
          <p>8.功能组件，最好至少带一个权限，不然菜单栏获取不到该列表</p>
          <p>9.编辑组件权限时，如果是新增，请不要将原先已存在的权限直接修改</p>
        </div>
      </el-form-item>
      <div>
        <el-form-item label="销售属性">
          <el-table
            :data="ruleForm.element_version"
            border
            style="width: 100%">
            <el-table-column
              prop="name"
              label="版本名称"
              width="150px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-input v-model="scope.row.name" maxlength="30" clearable/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="版本号"
              width="150px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-input v-model="scope.row.number" maxlength="30" clearable/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="ruleForm.type === 3"
              prop="number"
              label="终端"
              width="200px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-select v-model="scope.row.terminal" clearable multiple>
                    <el-option value="web" label="web"/>
                    <el-option value="h5" label="h5"/>
                    <el-option value="wechat" label="微信小程序"/>
                    <el-option value="alipay" label="支付宝小程序"/>
                    <el-option value="swan" label="百度小程序"/>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格/月"
              width="150px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-input v-model="scope.row.price" maxlength="30" clearable/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="discounts"
              label="优惠折扣"
              width="100px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-input v-model="scope.row.discounts" maxlength="30" clearable/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="min"
              label="起购期限/月"
              width="100px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-input v-model="scope.row.min" maxlength="30" clearable/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="max"
              label="最大期限/月"
              width="100px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-input v-model="scope.row.max" maxlength="30" clearable/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="relevance"
              label="关联属性"
              width="200px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-select v-model="scope.row.relevance" multiple placeholder="请选择" clearable>
                    <el-option-group
                      v-for="group in relevance"
                      :key="group.label"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-option-group>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120px;">
              <template slot-scope="scope">
                <div class="drawing">
                  <el-button type="danger" icon="el-icon-delete" circle @click="deleteSalesProperty(scope.$index)"/>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="addSalesProperty">添加销售属性</el-button>
          <div class="tip">
            <p>1.版本名称命名一般为基础版、高级版</p>
            <p>2.价格为每月的价格</p>
            <p>3.优惠折扣为折扣价格，如95即95折，不填写为无优惠</p>
            <p>4.最大期限必须大于等于起购期限</p>
            <p>5.关联属性允许关联多个组件，用来打包出售，规则：行业组件可以关联多个通用组件和功能组件；功能组件可以关联多个通用组件</p>
            <p>6.关联组件添加时，请确认功能组件中并未包含关联的通用组件，不然将导致重复</p>
            <p>7.销售属性不要随意删除，如已发布的组件进行了删除，将导致租户端数据错乱</p>
            <p>8.配置角色之前，请先选择关联属性</p>
            <p>9.当每个行业存在相同的版块时，可以通过版本ID来区分各行业，请谨慎删除操作</p>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="组件详情" prop="details">
        <!--<ds-editor :layouts="ruleForm.details"/>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogStatus==='create'?createSubmit():updateSubmit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getShow, createSubmit, updateSubmit, getRelevance, getElementRule } from '@/api/elements'
import DsEditor from '@/components/DsEditor'
export default {
  name: 'ElementsListDetail',
  components: { DsEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateIdentify = (rule, value, callback) => {
      if (!/^[A-Za-z_]+$/.test(value)) {
        callback(new Error('组件标识只能是英文字母加下划线'))
      } else {
        callback()
      }
    }
    var validateRoles = (rule, value, callback) => {
      var reg = /^[A-Za-z]+$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('hint.pleaseEnterLetter')))
      } else {
        callback()
      }
    }
    return {
      submitLoading: false,
      rolesloading: false,
      step: 0,
      textMap: {
        update: '修改',
        create: '添加'
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      lementRule: [],
      dialogStatus: 'create',
      dialogRolesStatus: 'create',
      actionurl: process.env.BASE_API + 'uploadPictures',
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      dialogFormVisible: false,
      temprules: {
        introduction: [
          { required: true, message: '角色名称不能为空', trigger: 'change' }
        ],
        roles: [
          { required: true, message: '角色标识不能为空', trigger: 'change' },
          { validator: validateRoles, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'change' }
        ]
      },
      temp: {
        introduction: '',
        roles: '',
        description: '',
        rule: []
      },
      id: '',
      versionRolesIndex: '',
      rolesIndex: '',
      ruleForm: {
        name: '',
        type: 1,
        identify: '',
        description: '',
        details: [],
        shows: 1,
        element_version: [],
        element_rule: [],
        rule: []
      },
      relevance: [],
      imgProgress: false,
      imglimit: 10,
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      imgProgressPercent: 0,
      rules: {
        name: [
          { required: true, message: '请填写组件名称', trigger: 'blur' }
        ],
        identify: [
          { required: true, message: '请填写组件标识', trigger: 'blur' },
          { validator: validateIdentify, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写组件描述', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择组件类型', trigger: 'change' }
        ],
        shows: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
    }
    // this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      if (this.id > 0) {
        getShow(this.id).then(response => {
          this.ruleForm = response.data
          if (this.ruleForm.type !== 1) {
            this.getRelevance(this.ruleForm.type)
          }
          this.dialogStatus = 'update'
          this.loading = false
        })
      } else {
        this.ruleForm.element_rule = [{
          api: 'List',
          icon: '',
          title: '查看',
          menu: true,
          sort: 5
        }, {
          api: 'Create',
          icon: '',
          title: '添加',
          menu: false,
          sort: 5
        }, {
          api: 'Update',
          icon: '',
          title: '编辑',
          menu: false,
          sort: 5
        }, {
          api: 'Delete',
          icon: '',
          title: '删除',
          menu: false,
          sort: 5
        }]
        getShow(0).then(response => {
          this.loading = false
        })
      }
    },
    // 获取关联属性
    getRelevance(value) {
      if (value !== 1) {
        getRelevance(this.ruleForm.type, this.ruleForm.id).then(response => {
          this.relevance = response.data
        })
      }
    },
    createSubmit() { // 添加
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          createSubmit(this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          })
        }
      })
    },
    updateSubmit() { // 更新
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateSubmit(this.ruleForm.id, this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          })
        }
      })
    },
    // 删除
    handleGoodsGalleryRemove(index) {
      this.ruleForm.img.splice(index, 1)
    },
    // 添加组件权限
    addRule() {
      this.ruleForm.element_rule.push({
        api: '',
        icon: '',
        title: '',
        menu: false,
        sort: 5
      })
    },
    // 删除组件权限
    deleteRule(index) {
      this.ruleForm.element_rule.splice(index, 1)
    },
    // 添加销售属性
    addSalesProperty() {
      this.ruleForm.element_version.push({
        name: '',
        price: '',
        number: '',
        terminal: '',
        discounts: '',
        min: '',
        max: '',
        rule: []
      })
    },
    // 删除销售属性
    deleteSalesProperty(index) {
      this.ruleForm.element_version.splice(index, 1)
    },
    // 添加角色
    addVersionRole(index) {
      this.rolesloading = true
      this.temp = {
        introduction: '',
        roles: '',
        description: '',
        rule: []
      }
      this.rolesIndex = index
      var relevance = this.ruleForm.element_version[index].relevance
      getElementRule(relevance).then(response => {
        this.lementRule = response.data
        // 添加角色组
        this.dialogFormVisible = true
        this.dialogRolesStatus = 'create'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.rolesloading = false
      })
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    // 更新角色权限
    updateVersionRule(row, index, indexs) {
      this.rolesloading = true
      this.temp = row
      /* if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.temp.rule)
      } */
      this.rolesIndex = index // 版本index
      this.versionRolesIndex = indexs // 版本对应的权限index
      var relevance = this.ruleForm.element_version[index].relevance
      getElementRule(relevance).then(response => {
        this.lementRule = response.data
        // 添加角色组
        this.dialogFormVisible = true
        this.dialogRolesStatus = 'update'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.rolesloading = false
      })
    },
    // 删除角色权限
    deleteVersionRule(index, indexs) {
      this.ruleForm.element_version[index].rule.splice(indexs, 1)
    },
    // 生成角色权限
    createMap() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.rule = this.$refs.tree.getCheckedKeys()
          this.$set(this.ruleForm.element_version[this.rolesIndex].rule, this.ruleForm.element_version[this.rolesIndex].rule.length, JSON.parse(JSON.stringify(this.temp)))
          this.dialogFormVisible = false
          this.$refs['dataForm'].resetFields()
        }
      })
    },
    // 生成更新角色权限
    updateMap() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.rule = this.$refs.tree.getCheckedKeys()
          this.$set(this.ruleForm.element_version[this.rolesIndex].rule, this.versionRolesIndex, JSON.parse(JSON.stringify(this.temp)))
          this.dialogFormVisible = false
          this.$refs['dataForm'].resetFields()
        }
      })
    },
    // 点击列表
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功
    handleAvatarSuccess(res, file, fileList) {
      this.ruleForm.img.push(file.response)
    },
    // 图片格式大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.imgProgress = true
      return isLt2M
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 188px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 188px;
    height: 188px;
    display: block;
  }
  .zimg{
    float:left;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 0px;
    position: relative;
  }
  .zimg .zimg-item-actions{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    padding-top: 60px;
  }
  .zimg .zimg-item-actions i{
    cursor:pointer;
  }
  .zimg .zimg-right{
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
  }
  .zimg .zimg-right-name {
    position: absolute;
    right: 2px;
    top: 8px;
    color: #ffffff;
    font-size: 12px;
  }
  .zimg .zimg-item-actions:hover{
    opacity: 1;
  }
  .zimg img{
    width:160px;
    height:160px;
  }
</style>
