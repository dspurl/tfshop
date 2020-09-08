<template>
  <div v-loading="listLoading" class="app-container">
    <!-- 订单详情 -->
    <el-card shadow="always">
      <el-row type="flex">
        <el-col :span="20" style="font-size: 18px;line-height: 45px;font-weight: bold;">订单号：{{ list.identification }}</el-col>
        <el-col :span="3" style="text-align: right;"><el-button v-if="list.shipping_status === 0 && list.state === 2" type="primary" @click="handleDelete(list, 2)">发货</el-button></el-col>
        <el-col :span="1"/>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="10">下单时间：{{ list.created_at }}</el-col>
        <el-col :span="10">买家信息：{{ list.good_location ? list.good_location.name : '' }}</el-col>
        <el-col :span="2" style="color: rgba(0, 0, 0, 0.447)">状态</el-col>
        <el-col :span="2" style="color: rgba(0, 0, 0, 0.447)">订单金额</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="10">备注：{{ list.remark ? list.remark : '无' }}</el-col>
        <el-col :span="10">联系方式：{{ list.good_location ? list.good_location.cellphone : '' }}</el-col>
        <el-col :span="2" style="font-weight: bold;font-size: 18px;">{{ list.state_show }}</el-col>
        <el-col :span="2" style="font-weight: bold;font-size: 18px;">¥ {{ list.total | 1000 }}</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col v-if="list.good_location" :span="10">收货地址：{{ list.good_location.location }} ({{ list.good_location.address }})</el-col>
        <el-col :span="10">优惠金额：¥ {{ list.coupon_money | 1000 }}</el-col>
      </el-row>
    </el-card>
    <!-- 订单进度 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>订单进度</span>
      </div>
      <el-steps :active="order_progress" align-center>
        <el-step :description="list.created_at" title="买家下单"/>
        <el-step :description="list.pay_time !== '1970-01-01 08:00:00' ? list.pay_time : ''" title="买家付款"/>
        <el-step :description="list.shipping_time !== '1970-01-01 08:00:00' ? list.shipping_time : ''" title="商家发货"/>
        <el-step :description="list.confirm_time !== '1970-01-01 08:00:00' ? list.confirm_time : ''" title="交易完成"/>
      </el-steps>
    </el-card>
    <!-- 商品信息 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <el-table
        :data="list.goods_list"
        :summary-method="getSummaries"
        border
        show-summary
        style="width: 100%">
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <img :src="scope.row.img" style="width:45px;height:45px;">
          </template>
        </el-table-column>
        <el-table-column label="商品" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格">
          <template slot-scope="scope">
            <span>{{ scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量（件）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price * scope.row.number }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 配送 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>配送</span>
      </div>
      <div v-if="list.state === 2">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
          <el-form-item label="运费">
            <span v-if="list.carriage">{{ list.carriage | 1000 }}元</span>
            <span v-else>免运费</span>
          </el-form-item>
          <el-form-item label="物流公司" prop="dhl_id">
            <el-select v-model="temp.dhl_id" placeholder="请选择" clearable>
              <el-option
                v-for="(item,index) in dhl"
                :key="index"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号" prop="odd">
            <el-input v-model="temp.odd" maxlength="255" clearable/>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-row type="flex" style="line-height: 35px;font-size: 14px;">
          <el-col v-if="list.carriage" :span="24">运费：{{ list.carriage | 1000 }}元</el-col>
          <el-col v-else :span="24">运费：免运费</el-col>
        </el-row>
        <el-row type="flex" style="line-height: 35px;font-size: 14px;">
          <el-col v-if="list.dhl" :span="24">物流公司：{{ list.dhl.name }}</el-col>
        </el-row>
        <el-row type="flex" style="line-height: 35px;font-size: 14px;">
          <el-col :span="24">运单号：{{ list.odd }}</el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 退款记录 -->
    <el-card v-if="list.refund_money" shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>退款详情</span>
      </div>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="24">退款金额：{{ list.refund_money | 1000 }}元</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="24">退款方式：{{ list.refund_way }}</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="24">退款说明：{{ list.refund_reason }}</el-col>
      </el-row>
    </el-card>
    <div class="right" style="margin-top: 20px;">
      <el-button v-if="list.state === 2" type="primary" @click="createSubmit()">发货</el-button>
      <el-button v-if="list.state !== 1 && !list.refund_money" type="primary" @click="dialogFormVisible = true">退款</el-button>
    </div>
    <!--退款-->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="退款">
      <el-form ref="refundForm" :rules="refundRules" :model="refundTemp" label-position="left" label-width="120px" style="width:700px;">
        <el-form-item label="退款金额" prop="refund_money" style="width:300px;">
          <el-input-number v-model="refundTemp.refund_money" :precision="2" :min="1" :max="list.total" label="退款金额"/>
        </el-form-item>
        <el-form-item label="退款方式" prop="refund_way">
          <el-radio-group v-model="refundTemp.refund_way">
            <el-radio :label="0">退到余额</el-radio>
            <el-radio :label="1">线下退款</el-radio>
          </el-radio-group>
          <el-alert
            title="退到余额：将款项退到用户余额中;线下退款：通过第三方退款或线下打款给用户"
            type="warning"/>
        </el-form-item>
        <el-form-item label="退款理由" prop="refund_reason" style="width:600px;">
          <el-input v-model="refundTemp.refund_reason" placeholder="请填写退款理由" maxlength="500" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button type="primary" @click="refundData()">{{ $t('usuel.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  .right{
    text-align: right;
  }
</style>
<script>
import { getDetails, createSubmit, updateSubmit } from '@/api/Indent'
import { dhlList } from '@/api/dhl'
export default {
  name: 'IndentListDetails',
  data() {
    return {
      order_progress: 0,
      list: '',
      dialogFormVisible: false,
      listLoading: true,
      id: this.$route.query.id,
      temp: {},
      rules: {
        dhl_id: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        odd: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ]
      },
      refundRules: {
        refund_money: [
          { required: true, message: '请输入退款金额', trigger: 'blur' }
        ],
        refund_way: [
          { required: true, message: '请选择退款方式', trigger: 'change' }
        ],
        refund_reason: [
          { required: true, message: '请输入退款原因', trigger: 'blur' }
        ]
      },
      refundTemp: {
        refund_way: 0,
        refund_reason: '',
        refund_money: ''
      },
      dhl: []
    }
  },
  created() {
    this.getList()
    this.getDhl()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDetails(this.id).then(response => {
        for (var k in response.data.goods_list) {
          switch (response.data.state) {
            case 1:
              this.order_progress = 1
              break
            case 2:
              this.order_progress = 2
              break
            case 3:
              this.order_progress = 3
              break
            case 5:
              this.order_progress = 4
              break
          }
          if (response.data.goods_list[k].good_sku) {
            response.data.goods_list[k].good_sku.product_sku.forEach(item => {
              if (response.data.goods_list[k].specification) {
                response.data.goods_list[k].specification += item.value + ';'
              } else {
                response.data.goods_list[k].specification = item.value + ';'
              }
            })
            response.data.goods_list[k].specification = response.data.goods_list[k].specification.substr(0, response.data.goods_list[k].specification.length - 1)
          }
        }
        this.list = response.data
        this.refundTemp.refund_money = this.list.total
        this.listLoading = false
      })
    },
    getDhl() {
      dhlList().then(response => {
        this.dhl = response.data
      })
    },
    createSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.list.id
          createSubmit(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '发货成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          })
        }
      })
    },
    refundData() { // 退款
      this.$refs['refundForm'].validate((valid) => {
        if (valid) {
          updateSubmit(this.list.id, this.refundTemp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '退款成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          })
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        } else if (index === 1 || index === 2 || index === 3) {
          return
        } else if (index === 4) {
          if (data.length > 0) {
            sums[index] = data.reduce((prev, curr) => {
              const value = Number(curr['number'])
              if (!isNaN(value)) {
                return prev + curr['number']
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 件'
          }
        } else if (index === 5) {
          if (data.length > 0) {
            sums[index] = data.reduce((prev, curr) => {
              const value = Number(curr['price'])
              if (!isNaN(value)) {
                return prev + curr['number'] * curr['price'] * 100
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index] / 100 + ' 元'
          }
        }
      })
      return sums
    }
  }
}
</script>
