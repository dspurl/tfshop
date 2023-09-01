<template>
  <div v-loading="listLoading" class="app-container">
    <!-- 订单详情 -->
    <el-card shadow="always">
      <el-row type="flex">
        <el-col :span="20" style="font-size: 18px;line-height: 45px;font-weight: bold;">{{ $t('good_indent.odd') }}：{{ list.identification }}【{{ list.type }}】</el-col>
        <el-col :span="3" style="text-align: right;"><el-button v-if="list.shipping_status === 0 && list.state === 2" type="primary" @click="handleDelete(list, 2)">
          {{ $t('good_indent.operation.shipments') }}</el-button></el-col>
        <el-col :span="1"/>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="10">{{ $t('good_indent.created_at') }}：{{ list.created_at }}</el-col>
        <el-col :span="10">{{ $t('good_indent.buyer_information') }}：{{ list.good_location ? list.good_location.name : '' }}</el-col>
        <el-col :span="2" style="color: rgba(0, 0, 0, 0.447)">{{ $t('good_indent.state') }}</el-col>
        <el-col :span="2" style="color: rgba(0, 0, 0, 0.447)">{{ $t('good_indent.total') }}</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="10">{{ $t('good_indent.remark') }}：{{ list.remark ? list.remark : $t('common.table.nothing') }}</el-col>
        <el-col :span="10">{{ $t('good_indent.contact_way') }}：{{ list.good_location ? list.good_location.cellphone : '' }}</el-col>
        <el-col :span="2" style="font-weight: bold;font-size: 18px;">{{ list.state_show }}</el-col>
        <el-col :span="2" style="font-weight: bold;font-size: 18px;">¥ {{ list.total | 1000 }}</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col v-if="list.good_location" :span="10">{{ $t('good_indent.location') }}：{{ list.good_location.location }} ({{ list.good_location.address }})</el-col>
      </el-row>
    </el-card>
    <!-- 订单进度 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ $t('good_indent.schedule') }}</span>
      </div>
      <el-steps :active="order_progress" align-center>
        <el-step :description="list.created_at" :title="$t('good_indent.buyer_order')"/>
        <el-step :description="list.pay_time !== '1970-01-01 08:00:00' ? list.pay_time : ''" :title="$t('good_indent.buyer_payment')"/>
        <el-step v-if="goodType !== $t('good.type.keys') && goodType !== $t('good.type.download')" :description="list.shipping_time !== '1970-01-01 08:00:00' ? list.shipping_time : ''" :title="$t('good_indent.merchant_delivery')"/>
        <el-step :description="list.confirm_time !== '1970-01-01 08:00:00' ? list.confirm_time : ''" :title="$t('good_indent.complete_transaction')"/>
      </el-steps>
    </el-card>
    <!-- 商品信息 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ $t('good_indent.commodity_information') }}</span>
        <el-link :underline="false" type="primary" class="invoice" @click="dialogInvoiceVisible = true">{{ $t('good_indent.delivery_slip') }}</el-link>
      </div>
      <el-table
        :data="list.goods_list"
        :summary-method="getSummaries"
        border
        show-summary
        style="width: 100%">
        <el-table-column
          :label="$t('good.table.id')"
          type="index"
          width="100"/>
        <el-table-column align="center" width="80">
          <template slot-scope="scope">
            <el-image :src="scope.row.img" :preview-src-list="[scope.row.img]" style="width:45px;height:45px;"/>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.delivery_slip.commodity')" align="left">
          <template slot-scope="scope">
            <router-link :to="{ path: '/commodityManagement/good/goodDetail', query: { id: scope.row.good_id }}" target="_blank"> {{ scope.row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.delivery_slip.type')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.good.type }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.delivery_slip.specification')">
          <template slot-scope="scope">
            <span>{{ scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="`${$t('good_indent.delivery_slip.unit_price')}(${$t('common.monetary_unit')})`" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.delivery_slip.amount')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="`${$t('good_indent.delivery_slip.money')}(${$t('common.monetary_unit')})`" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price * scope.row.number }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 在线支付记录 -->
    <el-card shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ $t('good_indent.payment_record') }}</span>
      </div>
      <el-table
        :data="list.payment_log_all"
        border
        style="width: 100%">
        <el-table-column :label="$t('good_indent.payment_record.name')" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.payment_record.number')" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.payment_record.transaction_id')" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.transaction_id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.payment_record.type_show')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type_show }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="`${$t('good_indent.payment_record.money_show')}(${$t('common.monetary_unit')})`" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.money_show | 1000 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('good_indent.payment_record.platform_show')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.platform_show }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.table.state')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.state_show }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 配送 -->
    <el-card v-if="list.good_location" shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ $t('good_indent.distribution') }}</span>
      </div>
      <div>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="160px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('good_indent.distribution.carriage')">
            <span v-if="list.carriage">{{ list.carriage | 1000 }}{{ $t('common.monetary_unit') }}</span>
            <span v-else>{{ $t('good_indent.distribution.free_shipping') }}</span>
          </el-form-item>
          <el-form-item :label="$t('good_indent.distribution.dhl')" prop="dhl_id">
            <div v-if="list.dhl && !temp.dhl">{{ list.dhl.name }}</div>
            <el-select v-else :placeholder="$t('common.select')" v-model="temp.dhl_id" clearable>
              <el-option
                v-for="(item,index) in dhl"
                :key="index"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('good_indent.distribution.odd')" prop="odd">
            <div v-if="list.odd && !temp.odd">{{ list.odd }}</div>
            <el-input v-else ref="odd" v-model="temp.odd" maxlength="255" clearable/>
          </el-form-item>
          <el-form-item v-if="list.state === 3">
            <el-button v-if="temp.id" :loading="shipmentLoading" type="primary" @click="setDhlUpdate">{{ $t('common.save') }}</el-button>
            <el-button v-else type="primary" @click="dhlUpdate">{{ $t('common.redact') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 延长收货时间 -->
    <el-card v-if="list.state === 3 && list.automaticReceivingState" shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ $('good_indent.overtime') }}</span>
      </div>
      <div>
        <el-form ref="receivingForm" :rules="receivingRules" :model="receivingTemp" label-width="120px" style="width: 400px; margin-left:50px;">
          <el-form-item :label="$t('good_indent.overtime.receiving_time')">
            <span>{{ list.receiving_time }}</span>
          </el-form-item>
          <el-form-item :label="$t('good_indent.overtime.new_receiving_time')" prop="new_receiving_time">
            <el-date-picker
              :placeholder="$t('common.select')"
              v-model="receivingTemp.new_receiving_time"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="shipmentLoading" type="primary" @click="receivingEdit">{{ $t('common.save') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 网盘 -->
    <el-card v-if="list.good_code.length" shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ code_type ? $t('good_indent.web_disk') : $t('good_indent.carmi') }}</span>
      </div>
      <div class="code-list">
        <div v-for="(item,index) in list.good_code" :key="index" class="li">
          <div v-if="item.name" class="name">{{ code_type ? $t('good_indent.web_disk.url') : $t('good_indent.web_disk.card_number') }}：{{ item.name }}<span class="el-icon-copy-document" @click="doCopy(item.name)"/></div>
          <div class="value">{{ code_type ? $t('good_indent.web_disk.code') : $t('good_indent.carmi') }}：{{ item.code }}<span class="el-icon-copy-document" @click="doCopy(item.code)"/></div>
        </div>
      </div>
    </el-card>
    <!-- 退款记录 -->
    <el-card v-if="list.refund_money" shadow="always" style="margin-top: 25px">
      <div slot="header" class="clearfix">
        <span>{{ $t('good_indent.web_disk.refund_details') }}</span>
      </div>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="24">{{ $t('good_indent.web_disk.refund_details.refund_money') }}({{ $t('common.monetary_unit') }})：{{ list.refund_money | 1000 }}</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="24">{{ $t('good_indent.web_disk.refund_details.refund_way') }}：{{ list.refund_way }}</el-col>
      </el-row>
      <el-row type="flex" style="line-height: 35px;font-size: 14px;">
        <el-col :span="24">{{ $t('good_indent.web_disk.refund_details.refund_reason') }}：{{ list.refund_reason }}</el-col>
      </el-row>
    </el-card>
    <div class="right" style="margin-top: 20px;filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9;">
      <el-button v-if="(list.state !== 1 && !list.refund_money) || !list.state === 8" :loading="shipmentLoading" type="danger" @click="dialogFormVisible = true">{{ $t('good_indent.operation.refund') }}</el-button>
      <el-button v-if="list.state === 2" :loading="shipmentLoading" type="primary" @click="shipmentSubmit()">{{ $t('good_indent.operation.shipments') }}</el-button>
    </div>
    <!--退款-->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :title="$t('good_indent.operation.refund')">
      <el-form ref="refundForm" :rules="refundRules" :model="refundTemp" label-position="left" label-width="160px">
        <el-form-item :label="$t('good_indent.web_disk.refund_details.refund_money')" prop="refund_money" style="width:300px;">
          <el-input-number v-model="refundTemp.refund_money" :precision="2" :min="0.01" :max="list.total" label="退款金额"/>
        </el-form-item>
        <el-form-item :label="$t('good_indent.web_disk.refund_details.refund_way')" prop="refund_way">
          <el-radio-group v-model="refundTemp.refund_way">
            <el-radio :label="0">{{ $t('good_indent.web_disk.refund_details.refund_way.balance') }}</el-radio>
            <el-radio :label="1">{{ $t('good_indent.web_disk.refund_details.refund_way.back_track') }}</el-radio>
          </el-radio-group>
          <div>{{ $t('good_indent.web_disk.refund_details.refund_way.tip') }}</div>
        </el-form-item>
        <el-form-item :label="$t('good_indent.web_disk.refund_details.refund_reason')" prop="refund_reason" style="width:600px;">
          <el-input :placeholder="$t('hint.error.please_enter', { attribute: $t('good_indent.web_disk.refund_details.refund_reason') })" v-model="refundTemp.refund_reason" maxlength="500" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :loading="shipmentLoading" type="primary" @click="refundData()">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 送货单-->
    <el-dialog v-if="list.good_location" :visible.sync="dialogInvoiceVisible" :close-on-click-modal="false" center fullscreen class="delivery">
      <div ref="print">
        <div class="text-center title">{{ name }}</div>
        <div class="text-center name">{{ $t('good_indent.delivery_slip') }}</div>
        <div class="message">
          <div><span>{{ $t('good_indent.customer') }}：</span>{{ list.good_location.name }}</div>
          <div><span>{{ $t('good_indent.order_number') }}：</span>{{ list.identification }}</div>
          <div><span>{{ $t('good_indent.order_date') }}：</span>{{ list.created_at }}</div>
        </div>
        <div class="location"><span>{{ $t('good_indent.delivery_address') }}：</span>{{ list.good_location.location }} ({{ list.good_location.address }})</div>
        <div class="message">
          <div><span>{{ $t('good_indent.good_location') }}：</span>{{ list.good_location.name }}</div>
          <div><span>{{ $t('good_indent.contact_number') }}：</span>{{ list.good_location.cellphone }}</div>
          <div><span/></div>
        </div>
        <div class="location"><span>{{ $t('good_indent.remark') }}：</span>{{ list.remark ? list.remark : '' }}</div>
        <el-table
          :data="list.goods_list"
          :summary-method="getSummaries"
          border
          show-summary
          style="width: 100%">
          <el-table-column
            :label="$t('good.table.id')"
            type="index"
            width="100"/>
          <el-table-column :label="$t('good_indent.identification')" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.identification }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good.table.number')" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.articleNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good.detail.name')" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good_indent.delivery_slip.specification')">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="`${$t('good_indent.delivery_slip.unit_price')}(${$t('common.monetary_unit')})`" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('good_indent.delivery_slip.amount')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="`${$t('good_indent.delivery_slip.money')}(${$t('common.monetary_unit')})`" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price * scope.row.number }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="operation">
        <el-button type="primary" @click="print()">{{ $t('common.print') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
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
  .code-list{
    font-size: 12px;
    .li{
      display: flex;
      line-height: 25px;
      .el-icon-copy-document{
        margin-left: 10px;
        cursor:pointer;
      }
      .name{
        margin-right: 50px;
      }
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
      list: {
        good_code: []
      },
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
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('good_indent.overtime.receiving_time') }), trigger: 'change' }
        ]
      },
      rules: {
        dhl_id: [
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('good_indent.distribution.dhl') }), trigger: 'change' }
        ],
        odd: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('good_indent.odd') }), trigger: 'blur' }
        ]
      },
      refundRules: {
        refund_money: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('good_indent.web_disk.refund_details.refund_money') }), trigger: 'blur' }
        ],
        refund_way: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('good_indent.web_disk.refund_details.refund_way') }), trigger: 'change' }
        ],
        refund_reason: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('good_indent.web_disk.refund_details.refund_reason') }), trigger: 'blur' }
        ]
      },
      refundTemp: {
        refund_way: 0,
        refund_reason: '',
        refund_money: '',
        refund_integral: '',
        integralDeduction: ''
      },
      dhl: [],
      goodType: this.$t('good.detail.form.type.radio_group.general'),
      code_type: 0
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
            case 11:
              this.order_progress = 4
              break
          }
          response.data.goods_list[k].identification = response.data.goods_list[k].good.identification
          response.data.goods_list[k].articleNumber = response.data.goods_list[k].good.number
          if (response.data.goods_list[k].good_sku) {
            this.code_type = response.data.goods_list[k].good_sku.code_type
            response.data.goods_list[k].good_sku.product_sku.forEach(item => {
              if (response.data.goods_list[k].specification) {
                response.data.goods_list[k].specification += item.key + ':' + item.value + ';'
              } else {
                response.data.goods_list[k].specification = item.key + ':' + item.value + ';'
              }
            })
            response.data.goods_list[k].specification = response.data.goods_list[k].specification.substr(0, response.data.goods_list[k].specification.length - 1)
          }
          this.goodType = response.data.goods_list[k].good.type
        }
        this.receivingTemp.new_receiving_time = response.data.receiving_time
        this.receivingTemp.id = response.data.id
        this.list = response.data
        this.refundTemp.refund_money = this.list.total
        this.refundTemp.refund_integral = this.list.integral
        this.refundTemp.integralDeduction = this.list.integralDeduction
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
      if (this.list.dhl_id > 0) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = this.list.id
            shipment(this.temp).then(() => {
              this.dialogFormVisible = false
              this.shipmentLoading = false
              this.$notify({
                title: this.$t('common.succeed'),
                message: this.$t('hint.succeed.win', { attribute: this.$t('good_indent.operation.shipments') }),
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
              message: this.$t('hint.error.please_enter', { attribute: this.$t('good_indent.logistics_information') }),
              type: 'warning',
              duration: 2000
            })
          }
        })
      } else {
        shipment({
          id: this.list.id
        }).then(() => {
          this.dialogFormVisible = false
          this.shipmentLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
            message: this.$t('hint.succeed.win', { attribute: this.$t('good_indent.operation.shipments') }),
            type: 'success',
            duration: 2000
          })
          setTimeout(this.$router.back(-1), 2000)
        }).catch(() => {
          this.shipmentLoading = false
        })
      }
    },
    refundData() { // 退款
      this.shipmentLoading = true
      this.$refs['refundForm'].validate((valid) => {
        if (valid) {
          refund(this.list.id, this.refundTemp).then(() => {
            this.dialogFormVisible = false
            this.shipmentLoading = false
            this.$notify({
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('good_indent.operation.refund') }),
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
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.save') }),
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
          title: this.$t('common.succeed'),
          message: this.$t('hint.succeed.win', { attribute: this.$t('common.amend') }),
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
          sums[index] = this.$t('good_indent.rental')
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
            sums[index] += ` ${this.$t('good_indent.piece')}`
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
            sums[index] = sums[index] / 100 + ` ${this.$t('common.monetary_unit')}`
          }
        }
      })
      return sums
    },
    doCopy(item) {
      this.$copyText(item).then(message => {
        this.$message({
          message: this.$t('hint.succeed.win', { attribute: this.$t('common.copy') }),
          type: 'success'
        })
      }).catch(() => {
        console.log('失败')
      })
    },
    // 打印
    print() {
      // 进行格式处理的数据
      const list = []
      const goods_list = JSON.parse(JSON.stringify(this.list.goods_list))
      goods_list.push({
        serial: this.$t('good_indent.total_prices'),
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
        <div style="text-align: center;font-size: 20px;font-weight: bold;padding-bottom: 50px;">${this.$t('good_indent.delivery_slip')}</div>
        <div style="display: flex;">
          <div style="line-height: 30px;flex:1;"><span>${this.$t('good_indent.customer')}：</span>${this.list.good_location.name}</div>
          <div style="line-height: 30px;flex:1;"><span>${this.$t('good_indent.order_number')}：</span>${this.list.identification}</div>
          <div style="line-height: 30px;flex:1;"><span>${this.$t('good_indent.order_date')}：</span>${this.list.created_at}</div>
        </div>
        <div style="line-height: 30px;"><span>${this.$t('good_indent.delivery_address')}：</span>${this.list.good_location.location}${this.list.good_location.address}</div>
        <div style="display: flex;">
          <div style="line-height: 30px;flex:1;"><span>${this.$t('good_indent.good_location')}：</span>${this.list.good_location.name}</div>
          <div style="line-height: 30px;flex:1;"><span>${this.$t('good_indent.contact_number')}：</span>${this.list.good_location.cellphone}</div>
          <div style="line-height: 30px;flex:1;"></div>
        </div>
        <div style="line-height: 30px;"><span>${this.$t('good_indent.remark')}：</span>${this.list.remark ? this.list.remark : ''}</div>`,
        properties: [
          {
            field: 'serial',
            displayName: this.$t('good.table.id')
          },
          {
            field: 'name',
            displayName: this.$t('good.detail.name')
          },
          {
            field: 'identification',
            displayName: this.$t('good_indent.identification')
          },
          {
            field: 'articleNumber',
            displayName: this.$t('good.table.number')
          },
          {
            field: 'specification',
            displayName: this.$t('good_indent.delivery_slip.specification')
          },
          {
            field: 'price',
            displayName: `${this.$t('good_indent.delivery_slip.unit_price')}`
          },
          {
            field: 'number',
            displayName: this.$t('good_indent.number')
          },
          {
            field: 'money',
            displayName: this.$t('good_indent.delivery_slip.money')
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
