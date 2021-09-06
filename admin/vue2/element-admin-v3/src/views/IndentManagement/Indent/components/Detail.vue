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
        <el-col v-if="list.good_location" :span="14">收货地址：{{ list.good_location.location }} ({{ list.good_location.address }})</el-col>
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
        <el-link :underline="false" type="primary" class="invoice" @click="dialogInvoiceVisible = true">送货单</el-link>
      </div>
      <el-table
        :data="list.goods_list"
        :summary-method="getSummaries"
        border
        show-summary
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="50"/>
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <el-image :src="scope.row.img" :preview-src-list="[scope.row.img]" style="width:45px;height:45px;"/>
          </template>
        </el-table-column>
        <el-table-column label="商品" align="left">
          <template slot-scope="scope">
            <router-link :to="{ path: '/commodityManagement/good/goodDetail', query: { id: scope.row.good_id }}" target="_blank"> {{ scope.row.name }}</router-link>
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
    <!-- 在线支付记录 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>在线支付记录</span>
      </div>
      <el-table
        :data="list.payment_log_all"
        border
        style="width: 100%">
        <el-table-column label="订单描述" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户订单号" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="第三方订单号" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.transaction_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type_show }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作金额（元）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.money_show | 1000 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.platform_show }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.state_show }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 配送 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>配送</span>
      </div>
      <div>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" style="width: 400px; margin-left:50px;">
          <el-form-item label="运费">
            <span v-if="list.carriage">{{ list.carriage | 1000 }}元</span>
            <span v-else>免运费</span>
          </el-form-item>
          <el-form-item label="物流公司" prop="dhl_id">
            <div v-if="list.dhl && !temp.dhl">{{ list.dhl.name }}</div>
            <el-select v-else v-model="temp.dhl_id" placeholder="请选择" clearable>
              <el-option
                v-for="(item,index) in dhl"
                :key="index"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号" prop="odd">
            <div v-if="list.odd && !temp.odd">{{ list.odd }}</div>
            <el-input v-else ref="odd" v-model="temp.odd" maxlength="255" clearable/>
          </el-form-item>
          <el-form-item v-if="list.state === 3">
            <el-button v-if="temp.id" :loading="shipmentLoading" type="primary" @click="setDhlUpdate">保存</el-button>
            <el-button v-else type="primary" @click="dhlUpdate">编辑</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 延长收货时间 -->
    <el-card v-if="list.state === 3 && list.automaticReceivingState" shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>延长收货时间</span>
      </div>
      <div>
        <el-form ref="receivingForm" :rules="receivingRules" :model="receivingTemp" label-width="120px" style="width: 400px; margin-left:50px;">
          <el-form-item label="自动收货时间">
            <span>{{ list.receiving_time }}</span>
          </el-form-item>
          <el-form-item label="设置收货时间" prop="new_receiving_time">
            <el-date-picker
              v-model="receivingTemp.new_receiving_time"
              type="date"
              placeholder="选择收货时间"
              value-format="yyyy-MM-dd HH:mm:ss"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="shipmentLoading" type="primary" @click="receivingEdit">保存</el-button>
          </el-form-item>
        </el-form>
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
    <div class="right" style="margin-top: 20px;filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9;">
      <el-button v-if="(list.state !== 1 && !list.refund_money) || !list.state === 8" :loading="shipmentLoading" type="danger" @click="dialogFormVisible = true">退款</el-button>
      <el-button v-if="list.state === 2" :loading="shipmentLoading" type="primary" @click="shipmentSubmit()">发货</el-button>
    </div>
    <!--退款-->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="退款">
      <el-form ref="refundForm" :rules="refundRules" :model="refundTemp" label-position="left" label-width="120px" style="width:700px;">
        <el-form-item label="退款金额" prop="refund_money" style="width:300px;">
          <el-input-number v-model="refundTemp.refund_money" :precision="2" :min="0.01" :max="list.total" label="退款金额"/>
        </el-form-item>
        <el-form-item label="退款方式" prop="refund_way">
          <el-radio-group v-model="refundTemp.refund_way">
            <el-radio :label="0">退到余额</el-radio>
            <el-radio :label="1">原路退回</el-radio>
          </el-radio-group>
          <el-alert
            title="退到余额：将款项退到用户余额中;原路退回：用户通过哪个支付途径付款，就退回哪里"
            type="warning"/>
        </el-form-item>
        <el-form-item label="退款理由" prop="refund_reason" style="width:600px;">
          <el-input v-model="refundTemp.refund_reason" placeholder="请填写退款理由" maxlength="500" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="shipmentLoading" type="primary" @click="refundData()">{{ $t('usuel.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 送货单-->
    <el-dialog v-if="list.good_location" :visible.sync="dialogInvoiceVisible" :close-on-click-modal="false" center fullscreen class="delivery">
      <div ref="print">
        <div class="text-center title">{{ name }}</div>
        <div class="text-center name">送货单</div>
        <div class="message">
          <div><span>客户姓名：</span>{{ list.good_location.name }}</div>
          <div><span>订单号：</span>{{ list.identification }}</div>
          <div><span>客户下单日期：</span>{{ list.created_at }}</div>
        </div>
        <div class="location"><span>送货地址：</span>{{ list.good_location.location }} ({{ list.good_location.address }})</div>
        <div class="message">
          <div><span>收货人：</span>{{ list.good_location.name }}</div>
          <div><span>联系电话：</span>{{ list.good_location.cellphone }}</div>
          <div><span/></div>
        </div>
        <div class="location"><span>备注：</span>{{ list.remark ? list.remark : '' }}</div>
        <el-table
          :data="list.goods_list"
          :summary-method="getSummaries"
          border
          show-summary
          style="width: 100%">
          <el-table-column
            type="index"
            label="编号"
            width="50"/>
          <el-table-column label="商品编码" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.identification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="货号" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.articleNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="left">
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
      </div>
      <div class="operation">
        <el-button type="primary" @click="print()">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .app-container{
    padding-bottom: 80px;
  }
  .right{
    position: fixed;
    bottom: 0;
    right: 0;
    padding-right: 10px;
    padding-top:10px;
    padding-bottom: 10px;
    width: 100%;
    margin-bottom: 0;
    background-color: #ffffff;
    text-align: right;
    z-index: 999;
    line-height: 50px;
    border-top: 1px solid #e5e5e5;
  }
  .invoice{
    float:right;
    margin-right: 10px;
  }
  .delivery{
    .title{
      font-size: 26px;
      font-weight: bold;
      line-height: 50px;
    }
    .name{
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 50px;
    }
    .message{
      display: flex;
      div{
        line-height: 30px;
        flex:1;
      }
    }
    .location{
      line-height: 30px;
    }
    .operation{
      position: absolute;
      bottom: 0;
      right: 0;
      padding-right: 10px;
      padding-top:10px;
      padding-bottom: 10px;
      width: 100%;
      margin-bottom: 0;
      background-color: #ffffff;
      text-align: right;
      z-index: 999;
      line-height: 50px;
      border-top: 1px solid #e5e5e5;
    }
  }
  @page {
    size: A4 landscape;
  }
  @media print {
    table,
    tbody,
    thead {
      width: 100% !important;
    }

    colgroup {
      position: absolute;
      width: 100% !important;
    }
    .el-table thead.is-group th {
      text-align: center
    }
    tbody {
      text-align: center;
      border: 1px solid #000;
    }
    th {
      border: 1px solid #000;
    }
    td {
      border: 1px solid #000;
    }
  }
</style>
<script>
import { detail, shipment, refund, query, dhl, receiving } from '@/api/indent'
import { getList } from '@/api/dhl'
import printJS from 'print-js'
export default {
  name: 'IndentListDetails',
  data() {
    return {
      shipmentLoading: false,
      name: process.env.SITE_NAME,
      dialogInvoiceVisible: false,
      queryLoading: false,
      order_progress: 0,
      logistics: false,
      list: '',
      dialogFormVisible: false,
      listLoading: true,
      id: this.$route.query.id,
      temp: {
        dhl_id: null,
        odd: ''
      },
      receivingTemp: {
        id: 0,
        new_receiving_time: ''
      },
      receivingRules: {
        new_receiving_time: [
          { required: true, message: '请设置新的自动收货时间', trigger: 'change' }
        ]
      },
      rules: {
        dhl_id: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        odd: [
          { required: true, message: '请输入运单号', trigger: 'blur' }
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
      detail(this.id).then(response => {
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
          response.data.goods_list[k].identification = response.data.goods_list[k].good.identification
          response.data.goods_list[k].articleNumber = response.data.goods_list[k].good.number
          if (response.data.goods_list[k].good_sku) {
            response.data.goods_list[k].good_sku.product_sku.forEach(item => {
              if (response.data.goods_list[k].specification) {
                response.data.goods_list[k].specification += item.key + ':' + item.value + ';'
              } else {
                response.data.goods_list[k].specification = item.key + ':' + item.value + ';'
              }
            })
            response.data.goods_list[k].specification = response.data.goods_list[k].specification.substr(0, response.data.goods_list[k].specification.length - 1)
          }
        }
        this.receivingTemp.new_receiving_time = response.data.receiving_time
        this.receivingTemp.id = response.data.id
        this.list = response.data
        this.refundTemp.refund_money = this.list.total
        // 同步支付信息
        const that = this
        this.list.payment_log_all.forEach(function(element) {
          if (element.state === 0) {
            that.queryNumber(element)
          }
        })
        this.listLoading = false
      })
    },
    getDhl() {
      getList().then(response => {
        this.dhl = response.data
        for (const item of this.dhl) {
          if (item.is_default === 1) {
            this.temp.dhl_id = item.id
            break
          }
        }
      })
    },
    shipmentSubmit() {
      this.shipmentLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.list.id
          shipment(this.temp).then(() => {
            this.dialogFormVisible = false
            this.shipmentLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '发货成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          }).catch(() => {
            this.shipmentLoading = false
          })
        } else {
          this.shipmentLoading = false
          this.$refs.odd.focus()
          this.$notify({
            title: '',
            message: '请输入物流信息',
            type: 'warning',
            duration: 2000
          })
        }
      })
    },
    refundData() { // 退款
      this.shipmentLoading = true
      this.$refs['refundForm'].validate((valid) => {
        if (valid) {
          refund(this.list.id, this.refundTemp).then(() => {
            this.dialogFormVisible = false
            this.shipmentLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '退款成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          }).catch(() => {
            this.shipmentLoading = false
          })
        } else {
          this.shipmentLoading = false
        }
      })
    },
    // 查询支付订单
    queryNumber(row) {
      query(row.id).then(() => {})
    },
    // 编辑配送信息
    dhlUpdate() {
      this.temp = this.list
    },
    // 保存配送信息
    setDhlUpdate() {
      this.shipmentLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          dhl(this.temp).then(() => {
            this.shipmentLoading = false
            this.temp = {}
            this.getList()
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.shipmentLoading = false
          })
        } else {
          this.shipmentLoading = false
        }
      })
    },
    // 延长收货时间
    receivingEdit() {
      this.shipmentLoading = true
      receiving(this.receivingTemp).then(() => {
        this.shipmentLoading = false
        this.getList()
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.shipmentLoading = false
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
        } else if (index === 6) {
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
        } else if (index === 7) {
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
    },
    // 打印
    print() {
      // 进行格式处理的数据
      const list = []
      const goods_list = JSON.parse(JSON.stringify(this.list.goods_list))
      goods_list.push({
        serial: '总价',
        money: 220,
        number: 1,
        name: '',
        identification: '',
        specification: '',
        articleNumber: '',
        price: ''
      })
      let money = 0
      let number = 0
      goods_list.forEach((item, index) => {
        item.serial = item.serial ? item.serial : index + 1
        if (item.money) {
          item.money = money
          item.number = number
        } else {
          money += item.price * item.number
          number += item.number
          item.money = item.price * item.number
        }
        list.push(item)
      })
      printJS({
        printable: list,
        header: `<div style="text-align: center;font-size: 26px;font-weight: bold;line-height: 50px;">${this.name}</div>
        <div style="text-align: center;font-size: 20px;font-weight: bold;padding-bottom: 50px;">送货单</div>
        <div style="display: flex;">
          <div style="line-height: 30px;flex:1;"><span>客户姓名：</span>${this.list.good_location.name}</div>
          <div style="line-height: 30px;flex:1;"><span>订单号：</span>${this.list.identification}</div>
          <div style="line-height: 30px;flex:1;"><span>下单日期：</span>${this.list.created_at}</div>
        </div>
        <div style="line-height: 30px;"><span>送货地址：</span>${this.list.good_location.location}${this.list.good_location.address}</div>
        <div style="display: flex;">
          <div style="line-height: 30px;flex:1;"><span>收货人：</span>${this.list.good_location.name}</div>
          <div style="line-height: 30px;flex:1;"><span>联系电话：</span>${this.list.good_location.cellphone}</div>
          <div style="line-height: 30px;flex:1;"></div>
        </div>
        <div style="line-height: 30px;"><span>备注：</span>${this.list.remark ? this.list.remark : ''}</div>`,
        properties: [
          {
            field: 'serial',
            displayName: '编号'
          },
          {
            field: 'name',
            displayName: '商品名称'
          },
          {
            field: 'identification',
            displayName: '商品编码'
          },
          {
            field: 'articleNumber',
            displayName: '货号'
          },
          {
            field: 'specification',
            displayName: '规格'
          },
          {
            field: 'price',
            displayName: '单价(元)'
          },
          {
            field: 'number',
            displayName: '数量'
          },
          {
            field: 'money',
            displayName: '金额'
          }
        ],
        type: 'json',
        gridHeaderStyle: 'border: 1px solid #000;text-align:center',
        gridStyle: 'border: 1px solid #000;text-align:center'
      })
    }
  }
}
</script>
