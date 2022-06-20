<template>
  <div class="container">
    <el-table
      :data="data"
      v-bind="$attrs"
      style="width: 100%"
      border
      v-on="$listeners">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          {{ scope.row.skus[index].v }}
        </template>
      </el-table-column>
      <el-table-column
        prop="img"
        label="图片"
        width="180">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="cost_price">
              <el-upload
                :show-file-list="false"
                :on-success="(response, i)=> specificationMarketAvatarSuccess(response, scope.$index)"
                :before-upload="beforeAvatarUpload"
                :action="actionurl"
                :headers="imgHeaders"
                :data="imgData"
                class="avatar-uploaders">
                <img v-if="scope.row.img" :src="scope.row.img" class="avatar" style="width:80px;height:80px;">
                <i v-else class="el-icon-plus avatar-uploader-icons"/>
              </el-upload>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="成本价(元)"
        width="150">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="cost_price">
              <el-input v-model="scope.row.cost_price" size="mini" placeholder="请输入成本价" clearable @input="e => updateInput(e, scope.$index, 'cost_price')"/>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="市场价(元)"
        width="150">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="market_price">
              <el-input v-model="scope.row.market_price" size="mini" placeholder="请输入市场价" clearable @input="e => updateInput(e, scope.$index, 'market_price')"/>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="销售价(元)"
        width="150">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="price">
              <el-input v-model="scope.row.price" size="mini" placeholder="请输入销售价" clearable @input="e => updateInput(e, scope.$index, 'price')"/>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="库存"
        width="150">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="inventory">
              <el-input v-model="scope.row.inventory" size="mini" placeholder="请输入库存" clearable @input="e => updateInput(e, scope.$index, 'inventory')"/>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type === 2"
        prop="good_code"
        label="虚拟商品"
        width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="addRuleForm(scope.row, scope.$index)">{{ scope.row.good_code ? '修改卡密' : '添加卡密' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type === 3"
        prop="file"
        label="文件"
        width="120">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="file">
              <avatar-image :height="80" :width="80" :file="scope.row.file" :format="fileFormat" :img-data="fileData" @getFile="e=> getFileFile(e, scope.$index)"/>
              <template v-if="scope.row.file">
                <div :title="scope.row.file_name" class="file-name">{{ scope.row.file_name }}</div>
              </template>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <!-- 卡密-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" center title="添加卡密">
      <el-form ref="dataForm" :model="ruleForm" label-position="cente" label-width="120px">
        <el-form-item label="卡密类型" prop="code_type">
          <el-radio-group v-model="ruleForm.code_type">
            <el-radio-button :label="0">卡密</el-radio-button>
            <el-radio-button :label="1">网盘</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否固定卡密" prop="is_fixed" style="margin-top: 10px;">
          <el-radio-group v-model="ruleForm.is_fixed" @change="changeIsFixed">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
          <p>如果是非固定卡密，请确保库存和卡密数量相同</p>
        </el-form-item>
        <el-form-item prop="good_code">
          <el-table
            :data="ruleForm.good_code"
            style="width: 100%;height: 200px;overflow-y: auto;">
            <el-table-column
              :label="ruleForm.code_type === 1 ? '网盘地址' : '卡号'"
              prop="name"
              width="250">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" :disabled="!!scope.row.state" :placeholder="ruleForm.code_type === 1 ? '请输入网盘地址' : '请输入卡号(非必填)'" size="mini" clearable/>
              </template>
            </el-table-column>
            <el-table-column
              :label="ruleForm.code_type === 1 ? '提取码' : '卡密'"
              prop="code"
              width="250">
              <template slot-scope="scope">
                <el-input v-model="scope.row.code" :disabled="!!scope.row.state" :placeholder="ruleForm.code_type === 1 ? '请输入提取码' : '请输入卡密'" size="mini" clearable/>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.state" size="mini" type="danger" @click="deleteGoodCode(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button v-if="(ruleForm.is_fixed === 1 && ruleForm.good_code.length === 0) || ruleForm.is_fixed === 0" size="mini" type="primary" icon="el-icon-plus" @click="addGoodCode()">新增</el-button>
          <el-button v-if="ruleForm.is_fixed === 0" size="mini" icon="el-icon-plus" @click="importGoodCode()">导入卡密</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGoodCode()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
.file-name{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { flatten, creatIds } from './utils'
import { diffArary } from '../../utils'
import { getToken } from '@/utils/auth'
import AvatarImage from '@/components/Upload/AvatarImage'

@Component({
  components: {
    AvatarImage
  },
  props: {
    specification: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: Number,
      default: 0
    },
    productSkus: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2,
        specification: [80, 150, 200, 250, 300, 350]
      },
      fileFormat: ['application/x-zip-compressed', 'application/zip', 'application/json', 'image/jpeg', 'image/png', 'image/gif'],
      fileData: {
        type: 2,
        full: true,
        size: 1024 * 1024 * 5
      },
      dialogFormVisible: false,
      ruleForm: {
        is_fixed: 1,
        code_type: 0,
        index: 0,
        good_code: []
      }
    }
  },
  computed: {
    skusList() {
      return flatten(this.specification).map(item => ({
        skus: item.skus,
        ids: creatIds(item.skus)
      }))
    },

    columns() {
      return this.specification.map(item => ({
        label: item.value,
        formater(row) {
          const sku = row.skus.find(sku => sku.k === item.value)
          return sku.v
        }
      }))
    }
  },
  methods: {
    updateInput(e, index, name) {
      this.data[index][name] = e
      this.data = JSON.parse(JSON.stringify(this.data))
    },
    // 父组件调用，修改统一数据
    _setInput(name, value, index, option_value) {
      this.data.map(item => {
        if (name === 'img') {
          if (item.product_sku[index].value === option_value) {
            item[name] = value
          }
        } else {
          item[name] = value
        }
      })
      this.data = JSON.parse(JSON.stringify(this.data))
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
      return isLt2M
    },
    // 规格图片上传
    specificationMarketAvatarSuccess(response, index) {
      this.data[index].img = response
      this.data = JSON.parse(JSON.stringify(this.data))
    },
    // 上传文件
    getFileFile(res, index) {
      this.data[index].file = res.response.url
      this.data[index].file_name = res.name
      this.data = JSON.parse(JSON.stringify(this.data))
    },
    // 卡密
    addRuleForm(res, index) {
      if (!res.good_code) {
        this.ruleForm = {
          is_fixed: 1,
          code_type: 0,
          index: index,
          good_code: []
        }
      } else {
        this.ruleForm.is_fixed = res.is_fixed
        this.ruleForm.code_type = res.code_type
        this.ruleForm.index = index
        this.ruleForm.good_code = res.good_code
      }
      this.dialogFormVisible = true
    },
    // 新增卡密
    addGoodCode() {
      this.ruleForm.good_code.push({
        name: '',
        code: ''
      })
    },
    // 导入卡密
    importGoodCode() {
      let inputPlaceholder = '每行一条卡密，每行格式：卡号1:卡密1'
      if (this.ruleForm.code_type === 1) {
        inputPlaceholder = '每行一条网盘数据，每行格式：网盘地址1:提取码1'
      }
      this.$prompt('请输入卡密', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: inputPlaceholder
      }).then(({ value }) => {
        const data = value.split(/[(\r\n)\r\n]+/)
        let line = null
        for (const dataKey in data) {
          line = data[dataKey].split(':')
          if (line.length < 2) {
            this.$message({
              type: 'info',
              message: '卡密格式有误'
            })
            return false
          }
          this.ruleForm.good_code.push({
            name: line[0],
            code: line[1]
          })
        }
      })
    },
    // 删除卡密
    deleteGoodCode(index) {
      this.ruleForm.good_code.splice(index, 1)
    },
    // 保存卡密
    saveGoodCode() {
      this.data[this.ruleForm.index].code_type = this.ruleForm.code_type
      this.data[this.ruleForm.index].good_code = this.ruleForm.good_code
      this.data[this.ruleForm.index].is_fixed = this.ruleForm.is_fixed
      this.dialogFormVisible = false
      this.data = JSON.parse(JSON.stringify(this.data))
    },
    // 选择是否固定
    changeIsFixed() {
      this.ruleForm.good_code = []
    }
  },
  watch: {
    skusList: {
      deep: true,
      immediate: true,
      handler(newSkus, oldSkus) {
        if (!newSkus.length) return (this.data = [])
        if (!oldSkus || !oldSkus.length) return this.initData(newSkus)
        if (newSkus.length === oldSkus.length) {
          // 当规格名和规格值数量未发生变化，更新 skus 即可
          return (this.data = newSkus.map((item, index) => ({
            ...this.data[index],
            ...item
          })))
        }

        // 当规格名的数量发生了变化
        if (newSkus[0].skus.length !== oldSkus[0].skus.length) {
          return this.initData(newSkus)
        }

        const diffIds = this.diffIds(newSkus, oldSkus)
        if (newSkus.length > oldSkus.length) {
          // 当添加了规格值
          const data = []
          newSkus.forEach(item => {
            const sku = this.data.find(_item => _item.ids === item.ids)
            if (sku) {
              data.push(sku)
            } else {
              data.push({
                ...item,
                format: '',
                guide_price: undefined,
                purchase_price: undefined,
                sell_price: undefined
              })
            }
          })
          this.data = data
        } else {
          // 当删除了规格值
          this.data = this.data.filter(_item => !diffIds.includes(_item.ids))
        }
      }
    }
  }
})
class SkuTable extends Vue {
  data = []
  coefficient = {
    purchase_coefficient: 0,
    guide_coefficient: 0
  }
  columnsProps = {
    align: 'center',
    minWidth: 100
  }

  diffIds(skusList1, skusList2) {
    // 两个数据的 ids 进行相差
    skusList1 = skusList1.map(item => item.ids)
    skusList2 = skusList2.map(item => item.ids)
    return diffArary(skusList1, skusList2)
  }

  initData(skusList) {
    if (this.productSkus && this.productSkus.length) {
      // 初始化数据
      this.data = this.productSkus
      this.$emit('update:productSkus', [])
      return
    }
    this.data = skusList.map(item => ({
      ...item,
      // 初始化属性
      format: '',
      guide_price: undefined,
      purchase_price: undefined,
      sell_price: undefined
    }))
  }
}

export default SkuTable
</script>

