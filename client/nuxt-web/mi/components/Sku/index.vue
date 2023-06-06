<!--
使用方法
 <Sku :getList="getList" @toggleSpec="toggleSpec"></Sku>
 getList：商品数据
 update: 是否是更新

 cartDetails: 购物车时的单条数据
 @toggleSpec:弹出框操作
 @purchasePattern: 购买类型展示
 @loadCart:完成时触发

 order: 是否是订单
 @setOrder:修改后传给父节点的值，用来父节点商品更新
 -->
<template>
	<div>
    <div v-for="(item, index) in specification" :key="index" class="specification-list">
      <div class="name">{{$t('hint.error.select', { attribute:item.value })}}</div>
      <div class="item-list">
        <div
          v-for="(childItem, childIndex) in item.leaf"
          :key="childIndex"
          class="item"
          :class="{ selected: childItem.selected, disabled: childItem.disabled}"
          @click="selectSpec(index, childIndex,childItem)"
        >
          {{ childItem.value }}
        </div>
      </div>
    </div>
    <div class="purchase-quantity">
      <div class="name">{{$t('sku.purchase_quantity')}}</div>
      <div class="quantity">
        <el-input-number v-model="cartGood.number>specificationDefaultDisplay.inventory_show?specificationDefaultDisplay.inventory_show:cartGood.number" @change="numberChange" :min="1" :max="getLists.purchase_number ? getLists.purchase_number : specificationDefaultDisplay.inventory_show"></el-input-number>
      </div>
      <div class="inventory">{{$t('good_indent.piece')}} ({{$t('good.table.inventory')}}：{{specificationDefaultDisplay.inventory_show}}{{$t('good_indent.piece')}})</div>
    </div>
	</div>
</template>

<style lang='scss' scoped>
  @import "./scss/index";
</style>

<script>
import js from './js/index'
export default js
</script>
