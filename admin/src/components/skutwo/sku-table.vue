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
        fixed="right"
        label="成本价(元)"
        width="120">
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
        fixed="right"
        label="市场价(元)"
        width="120">
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
        fixed="right"
        label="销售价(元)"
        width="120">
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
        fixed="right"
        label="库存"
        width="120">
        <template slot-scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="inventory">
              <el-input v-model="scope.row.inventory" size="mini" placeholder="请输入库存" clearable @input="e => updateInput(e, scope.$index, 'inventory')"/>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { flatten, creatIds } from './utils'
import { diffArary } from '../../utils'
import { getToken } from '@/utils/auth'

@Component({
  props: {
    specification: {
      type: Array,
      default() {
        return []
      }
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
    _setInput(name, value) {
      this.data.map(item => {
        item[name] = value
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

