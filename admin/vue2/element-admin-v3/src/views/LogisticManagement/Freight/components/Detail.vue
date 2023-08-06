<!--suppress ALL -->
<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="180px" class="demo-ruleForm" style="padding-left: 200px;padding-right:20px;">
      <el-form-item :label="$t('freight.name')" prop="name">
        <el-input v-model="ruleForm.name" maxlength="60" clearable style="width: 400px;"/>
      </el-form-item>
      <el-form-item :label="$t('freight.location')" prop="location">
        <el-cascader
          v-loading="pcasLoading"
          ref="cascaderAddr"
          :options="options"
          v-model="ruleForm.location"
          :props="{ value: 'id', label: 'name' }"/>
      </el-form-item>
      <el-form-item :label="$t('freight.valuation')" prop="valuation">
        <el-radio-group v-model="ruleForm.valuation">
          <el-radio :label="0">{{ $t('freight.valuation.piece') }}</el-radio>
          <el-radio :label="1">{{ $t('freight.valuation.weight') }}</el-radio>
          <el-radio :label="2">{{ $t('freight.valuation.volume') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('freight.valuation.volume.no_free_delivery_area')" class="distribution-area">
        <el-table
          :data="ruleForm.freight_way"
          border
          style="width: 100%;padding-bottom: 10px;">
          <el-table-column
            :label="$t('freight.delivery')"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.location_name.join(",") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('freight.first_piece')"
            prop="first_piece"
            width="180"/>
          <el-table-column
            :label="$t('freight.first_cost')"
            prop="first_cost"/>
          <el-table-column
            :label="$t('freight.add_piece')"
            prop="add_piece"/>
          <el-table-column
            :label="$t('freight.add_cost')"
            prop="add_cost"/>
          <el-table-column
            :label="$t('common.operation')"
            width="120">
            <template slot-scope="scope">
              <el-tooltip :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
                <el-button type="primary" icon="el-icon-edit" circle @click="distributionArea(scope.row, scope.$index)"/>
              </el-tooltip>
              <el-tooltip :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
                <el-button type="danger" icon="el-icon-delete" circle @click="distributionDelete(scope.$index)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div>{{ $t('freight.tip') }}</div>
        <el-button type="warning" style="margin-top: 10px;" round @click="distributionArea()">{{ $t('freight.add_shipping_areas_and_freight') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :loading="dialogLoading" type="primary" @click="dialogStatus==='create'?create():edit()">{{ $t('common.submit') }}</el-button>
      </el-form-item>
    </el-form>
    <!--添加-->
    <el-dialog :visible.sync="dialogFormVisible" :title="$t('freight.valuation.volume.no_free_delivery_area')">
      <el-form :rules="distribution_rules" label-position="left" label-width="150px" style="margin-left:50px;">
        <el-form-item :label="$t('freight.valuation.volume.distribution_area')" prop="location">
          <el-tag
            v-for="(item, index) in provinces"
            v-if="!item.hide || item.itself"
            :key="item.name"
            :effect="item.on ? 'dark' : 'plain'"
            class="distribution-tag"
            @click="setTag(index)">
            {{ item.name }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('freight.valuation.distribution_cost')">
          <el-form ref="dataForm" :model="temp" :inline="true" :rules="distribution_rules" class="demo-form-inline">
            <el-form-item :label="$t('freight.first_piece')" prop="first_piece">
              <el-input v-model="temp.first_piece" style="width: 80px;" maxlength="11"/>
            </el-form-item>
            <el-form-item :label="$t('freight.first_cost')" prop="first_cost">
              <el-input v-model="temp.first_cost" style="width: 80px;" maxlength="11"/>
            </el-form-item>
            <el-form-item :label="$t('freight.add_piece')" prop="add_piece">
              <el-input v-model="temp.add_piece" style="width: 80px;" maxlength="11"/>
            </el-form-item>
            <el-form-item :label="$t('freight.add_cost')" prop="add_cost">
              <el-input v-model="temp.add_cost" style="width: 80px;" maxlength="11"/>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="distributionStatus==='create'?distributionSubmit():distributionSubmit()">{{ $t('common.confirm') }}</el-button>
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
import { getList } from '@/api/region'
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
      options: [],
      provinces: [],
      selectedOptions: [],
      dialogVisible: false,
      loading: false,
      pcasLoading: false,
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
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('freight.name') }), trigger: 'blur' }
        ],
        location: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('freight.location') }), trigger: 'change' }
        ],
        valuation: [
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('freight.valuation') }), trigger: 'change' }
        ]
      },
      distribution_rules: {
        location: [
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('freight.valuation.volume.distribution_area') }), trigger: 'blur' }
        ],
        first_piece: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('freight.first_piece') }), trigger: 'blur' }
        ],
        first_cost: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('freight.first_cost') }), trigger: 'blur' }
        ],
        add_piece: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('freight.add_piece') }), trigger: 'blur' }
        ],
        add_cost: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('freight.add_cost') }), trigger: 'blur' }
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
    this.getPcas()
    this.getList()
  },
  methods: {
    getPcas() {
      this.pcasLoading = true
      getList({
        parent_id: 0,
        all: true
      }).then(response => {
        if (response.data.length) {
          this.options = response.data[0].children
          this.getProvinces(response.data[0])
        }
      })
    },
    getProvinces(parent) {
      getList({
        parent_id: parent.id
      }).then(response => {
        this.provinces = response.data
        this.pcasLoading = false
      })
    },
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
          if (row.location.indexOf(this.provinces[index].id) !== -1) {
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
              location.push(this.provinces[index].id)
              locationName.push(this.provinces[index].name)
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
              this.ruleForm.pinkage.push(this.provinces[index].id)
            }
          }
          create(this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$notify({
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.add') }),
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
              this.ruleForm.pinkage.push(this.provinces[index].id)
            }
          }
          edit(this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.dialogLoading = false
            this.$notify({
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.update') }),
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
