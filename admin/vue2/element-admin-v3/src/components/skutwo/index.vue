<style lang="sass" scoped>
.sku_container
  margin-bottom: 30px
  font-size: 12px
  color: #666
  padding: 10px
  border: 1px solid #e5e5e5

.remove
  display: none
  position: absolute
  z-index: 2
  width: 18px
  height: 18px
  font-size: 14px
  line-height: 16px
  color: #fff
  text-align: center
  cursor: pointer
  background: rgba(0,0,0,.3)
  border-radius: 50%

.sku_group
  margin-bottom: 10px
  &:hover
    .spec_title .remove
      display: block

.spec_title
  position: relative
  padding: 7px 10px
  background-color: #f8f8f8
  line-height: 16px
  font-weight: 400

  .input
    width: 200px

  .remove
    top: 12px
    right: 10px

.group_container
  padding: 10px 10px 0

  .input
    width: 250px

  .sku_item
    background-color: #f8f8f8
    padding-left: 20px
    padding-right: 20px
    display: inline-block
    margin-right: 10px
    vertical-align: middle
    text-align: center
    position: relative
    border-radius: 2px
    cursor: pointer

    &:hover
      .remove
        display: block

    .remove
      top: -8px
      right: -8px

    .text
      display: block
      margin: 0 auto
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
.sku-unified-set
  width: 300px
  .input
    margin-bottom: 10px
</style>

<template lang="pug">
.container
  h3 设置产品参数
  el-form-item
      .sku_container
        .sku_group.mb10(v-for="(spec, index) in specification" :key="spec.id")
          .spec_title
            span.label 规格名：
            el-input.input(placeholder='请输入规格名' v-model.trim="spec.value")
            span.remove(@click="delSepc(index)") ×

          .group_container
            span.label 规格值：
            el-popover(
              placement="bottom"
              width="120"
              trigger="click"
              v-for="(option, option_index) in spec.leaf" :key="option_index"
            )
              el-input(v-model.trim="option.value" style="width: 110px;")
              .sku_item(slot="reference")
                span.remove(@click.stop="delOption(index, option_index)") ×
                .text {{option.value}}

            el-input.input(
              suffix-icon="el-icon-plus"
              v-model="addValues[index]"
              placeholder="多个产品属性以空格隔开"
              @keyup.native.enter='addOption(index)'
              @blur='addOption(index)'
            )
        .spec_title
          el-button(type='info' :disabled='disabled' @click='addSpec') 添加规格项目
  el-form-item(
    label="统一设置"
    class="sku-unified-set"
  )
    el-input.input(
      placeholder="成本价"
      v-model="allUnified.cost_price"
      clearable
      @input="e => updateUnifiedInput(e, 'cost_price')"
    )
    el-input.input(
      placeholder="市场价"
      v-model="allUnified.market_price"
      clearable
      @input="e => updateUnifiedInput(e, 'market_price')"
    )
    el-input.input(
      placeholder="销售价"
      v-model="allUnified.price"
      clearable
      @input="e => updateUnifiedInput(e, 'price')"
    )
    el-input.input(
      placeholder="库存"
      v-model="allUnified.inventory"
      clearable
      @input="e => updateUnifiedInput(e, 'inventory')"
    )
  el-form-item
      .sku_container
        SkuTable(:specification.sync="specificationFilter" :productSkus.sync="productSkus" ref="SkuTable")
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import SkuTable from './sku-table'
import { createUniqueString, uniqueArr } from '../../utils'
import { param2Data } from './sku2param'

@Component({
  components: {
    SkuTable
  }
})
class EditSku extends Vue {
  // 用来存储要添加的规格属性
  addValues = []
  productSkus = []
  specification = []
  allUnified = {
    cost_price: null,
    market_price: null,
    price: null,
    inventory: null
  }

  get disabled() {
    return (
      // this.specification.length > 3 ||
      this.specification.some(item => !item.value)
    )
  }

  get specificationFilter() {
    return this.specification.filter(item => item.value && item.leaf.length)
  }

  // 父组件调用，初始化数据
  _setData(data) {
    if (!data || !data.length) return
    const { productSkus, specification } = param2Data(data)
    this.specification = specification
    this.productSkus = Object.freeze(productSkus)
  }

  // 父组件调用，获取 sku-table 的数据
  _getData() {
    return this.$refs.SkuTable.data
  }

  addSpec() {
    this.specification.push({
      id: createUniqueString() + '_id',
      value: '',
      leaf: []
    })
  }

  delSepc(index) {
    this.specification.splice(index, 1)
  }

  addOption(index) {
    let str = this.addValues[index] || ''
    str = str.trim()
    if (!str) return
    const oldArr = this.specification[index].leaf
    const arr = str
      .split(/\s+/) // 使用空格分割成数组
      .filter(value => !oldArr.some(option => option.value === value)) // 过滤掉 oldArr 已存在的 value
      .map(value => ({ id: createUniqueString() + '_id', value })) // 把 value 转成对象，id 设置为 null
    this.specification[index].leaf = uniqueArr([...oldArr, ...arr])
    this.$set(this.addValues, index, '')
  }

  delOption(spec_index, option_index) {
    this.specification[spec_index].leaf.splice(option_index, 1)
  }

  updateUnifiedInput(e, name) {
    this.$refs.SkuTable._setInput(name, e)
  }
}

export default EditSku
</script>
