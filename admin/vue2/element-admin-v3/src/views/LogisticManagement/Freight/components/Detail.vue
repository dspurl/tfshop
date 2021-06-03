<!--suppress ALL -->
<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm" style="padding-left: 200px;padding-right:20px;">
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="60" clearable style="width: 400px;"/>
      </el-form-item>
      <el-form-item label="宝贝地址" prop="location">
        <el-cascader
          ref="cascaderAddr"
          :options="options"
          v-model="ruleForm.location"/>
      </el-form-item>
      <el-form-item label="计价方式" prop="valuation">
        <el-radio-group v-model="ruleForm.valuation">
          <el-radio :label="0">按件数</el-radio>
          <el-radio :label="1">按重量</el-radio>
          <el-radio :label="2">按体积</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="不包邮配送区域" class="distribution-area">
        <el-table
          :data="ruleForm.freight_way"
          border
          style="width: 100%;padding-bottom: 10px;">
          <el-table-column
            label="送货到"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.location_name.join(",") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="first_piece"
            label="首件"
            width="180"/>
          <el-table-column
            prop="first_cost"
            label="首费"/>
          <el-table-column
            prop="add_piece"
            label="续件"/>
          <el-table-column
            prop="add_cost"
            label="续费"/>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button type="primary" icon="el-icon-edit" circle @click="distributionArea(scope.row, scope.$index)"/>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button type="danger" icon="el-icon-delete" circle @click="distributionDelete(scope.$index)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-alert
          :closable="false"
          title="不在'不包邮配送区域'的，都按包邮处理"
          type="warning"/>
        <el-button type="warning" style="margin-top: 10px;" round @click="distributionArea()">添加可配送区域和运费</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :loading="dialogLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
      </el-form-item>
    </el-form>
    <!--添加-->
    <el-dialog :visible.sync="dialogFormVisible" title="不包邮配送区域">
      <el-form :rules="distribution_rules" label-position="left" label-width="80px" style="margin-left:50px;">
        <el-form-item label="配送区域" prop="location">
          <el-tag
            v-for="(item, index) in provinces"
            v-if="!item.hide || item.itself"
            :key="item.label"
            :effect="item.on ? 'dark' : 'plain'"
            class="distribution-tag"
            @click="setTag(index)">
            {{ item.label }}
          </el-tag>
        </el-form-item>
        <el-form-item label="配送费用">
          <el-form ref="dataForm" :model="temp" :inline="true" :rules="distribution_rules" class="demo-form-inline">
            <el-form-item label="首件数" prop="first_piece">
              <el-input v-model="temp.first_piece" style="width: 80px;" maxlength="11"/>
            </el-form-item>
            <el-form-item label="首费" prop="first_cost">
              <el-input v-model="temp.first_cost" style="width: 80px;" maxlength="11"/>
            </el-form-item>
            <el-form-item label="续件数" prop="add_piece">
              <el-input v-model="temp.add_piece" style="width: 80px;" maxlength="11"/>
            </el-form-item>
            <el-form-item label="续费" prop="add_cost">
              <el-input v-model="temp.add_cost" style="width: 80px;" maxlength="11"/>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="distributionStatus==='create'?distributionSubmit():distributionSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
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
  .distribution-area{
    position: relative;
  }
  .distribution-area .el-icon-circle-close{
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    cursor:pointer;
  }
  .distribution-tag{
    margin-right: 5px;
    cursor:pointer;
  }
</style>
<script>
import { detail, create, edit } from '@/api/freight'
const pcas = require('../../../../assets/pcas-code')
const provinces = require('../../../../assets/provinces')
export default {
  name: 'FreightDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLoading: false,
      dialogLoading: false,
      distributionIndex: 0,
      distributionIndexOn: 0,
      copy: false,
      distributionStatus: 'create',
      dialogFormVisible: false,
      effect: 'plain',
      options: pcas,
      provinces: provinces,
      selectedOptions: [],
      dialogVisible: false,
      loading: false,
      id: '',
      temp: {
        location: [],
        location_name: [],
        first_piece: '',
        first_cost: '',
        add_piece: '',
        add_cost: ''
      },
      ruleForm: {
        location: [],
        name: '',
        valuation: 0,
        freight_way: [],
        pinkage: []
      },
      imgProgress: false,
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请选择宝贝地址', trigger: 'change' }
        ],
        valuation: [
          { required: true, message: '请选择计价方式', trigger: 'change' }
        ]
      },
      distribution_rules: {
        location: [
          { required: true, message: '请选择配送区域', trigger: 'blur' }
        ],
        first_piece: [
          { required: true, message: '请输入首件数', trigger: 'blur' }
        ],
        first_cost: [
          { required: true, message: '请输入首费', trigger: 'blur' }
        ],
        add_piece: [
          { required: true, message: '请输入续件数', trigger: 'blur' }
        ],
        add_cost: [
          { required: true, message: '请输入续费', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
    }
    if (this.$route.query.copy) {
      this.copy = this.$route.query.copy
      this.id = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.initProvinces()
      if (this.id > 0) {
        detail(this.id).then(response => {
          this.ruleForm = response.data
          if (!this.copy) {
            this.dialogStatus = 'update'
          } else {
            this.ruleForm.name = this.ruleForm.name + '副本'
          }
          for (const index in this.provinces) {
            this.ruleForm.freight_way.forEach(item => {
              item.location.forEach(item2 => {
                if (this.provinces[index].value === item2) {
                  this.provinces[index].hide = true
                  this.provinces[index].on = true
                }
              })
            })
          }
          this.distributionIndexOn = this.ruleForm.freight_way.length
          this.distributionIndex = this.ruleForm.freight_way.length + 1
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    initProvinces() {
      for (const index in this.provinces) {
        this.provinces[index].hide = false
        this.provinces[index].on = false
        this.provinces[index].itself = false
      }
    },
    setTag(e) {
      const provinces = this.provinces
      if (provinces[e].on && provinces[e].hide) {
        provinces[e].hide = false
      }
      provinces[e].on = !provinces[e].on
      this.provinces = Object.assign([], provinces)
    },
    distributionArea(row, index) {
      this.initTemp()
      this.distributionStatus = 'create'
      if (row) {
        this.distributionStatus = 'update'
        this.distributionIndexOn = index
        for (const index in this.provinces) {
          if (row.location.indexOf(this.provinces[index].value) !== -1) {
            this.provinces[index].itself = true
            this.provinces[index].on = true
          }
        }
        this.temp = Object.assign({}, row)
      } else {
        this.temp.location = []
        this.temp.location_name = []
        this.distributionIndexOn = this.distributionIndex
        this.distributionIndex = this.distributionIndex + 1
      }
      this.dialogFormVisible = true
    },
    // 删除
    distributionDelete(index) {
      const location = this.ruleForm.freight_way[index].location
      for (const index in this.provinces) {
        for (const indexs in location) {
          if (this.provinces[index].value === location[indexs]) {
            this.provinces[index].on = false
            this.provinces[index].hide = false
            this.provinces[index].itself = false
          }
        }
      }
      this.ruleForm.freight_way.splice(index, 1)
    },
    distributionSubmit() {
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const location = []
          const locationName = []
          for (const index in this.provinces) {
            if (this.provinces[index].on) {
              this.provinces[index].hide = true
              this.$set(this.provinces, index, this.provinces[index])
              location.push(this.provinces[index].value)
              locationName.push(this.provinces[index].label)
            }
          }
          this.temp.location = location
          this.temp.location_name = locationName
          this.$set(this.ruleForm.freight_way, this.distributionIndexOn, this.temp)
          this.dialogFormVisible = false
          this.formLoading = false
          this.initTemp()
        } else {
          this.formLoading = false
        }
      })
    },
    initTemp() {
      for (const index in this.provinces) {
        this.provinces[index].on = false
        this.provinces[index].itself = false
      }
      this.temp = {
        location: [],
        location_name: [],
        first_piece: '',
        first_cost: '',
        add_piece: '',
        add_cost: ''
      }
    },
    create() { // 添加
      this.dialogLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // 获取包邮地域
          this.ruleForm.pinkage = []
          for (const index in this.provinces) {
            if (!this.provinces[index].hide) {
              this.ruleForm.pinkage.push(this.provinces[index].value)
            }
          }
          create(this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          }).catch(() => {
            this.dialogLoading = false
          })
        } else {
          this.dialogLoading = false
        }
      })
    },
    edit() { // 更新
      this.dialogLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // 获取包邮地域
          this.ruleForm.pinkage = []
          for (const index in this.provinces) {
            if (!this.provinces[index].hide) {
              this.ruleForm.pinkage.push(this.provinces[index].value)
            }
          }
          edit(this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          }).catch(() => {
            this.dialogLoading = false
          })
        } else {
          this.dialogLoading = false
        }
      })
    }
  }
}
</script>
