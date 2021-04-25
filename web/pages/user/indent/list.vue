<template>
  <div class="box">
    <div class="user-title">我的订单</div>
    <div class="padding-top-20">
      <el-tabs v-model="listQuery.index" @tab-click="getReloadList">
        <el-tab-pane label="全部订单" name="0"></el-tab-pane>
        <el-tab-pane label="待支付" name="1"></el-tab-pane>
        <el-tab-pane label="待发货" name="2"></el-tab-pane>
        <el-tab-pane label="待收货" name="3"></el-tab-pane>
      </el-tabs>
      <div class="indent-list" v-loading="loading">
        <div class="navigation">
          <div class="good">宝贝</div>
          <div class="total">实付款</div>
          <div class="state">交易状态</div>
          <div class="operation">交易操作</div>
        </div>
        <div class="li" v-for="(item, index) in goodIndentList" :key="index">
          <div class="top">
            <div class="time">{{item.created_at}}</div>
            <div class="odd">订单号: <span>{{item.identification}}</span></div>
            <div class="delete"v-if="item.state===4 || item.state===5 || item.state===6 || item.state===7" @click="deleteOrder(item)"><i class="el-icon-delete"></i></div>
          </div>
          <div class="details">
            <div class="good">
              <div class="good-li"  v-for="(item2, index2) in item.goods_list" :key="index2">
                <NuxtLink :to="{ path: '/product/detail', query: { id: item2.good_id }}">
                  <el-image
                    class="image"
                    :src="item2.img | smallImage(80)"
                    fit="cover"/>
                </NuxtLink>
                <div class="good-name">
                  <NuxtLink :to="{ path: '/product/detail', query: { id: item2.good_id }}">{{item2.name}}</NuxtLink>
                  <div class="price">￥{{item2.price}} x {{item2.number}}</div>
                  <div class="specification">{{item2.specification}}</div>
                </div>
              </div>
            </div>
            <div class="total">
              <div>
                <div>￥{{item.total | thousands}}</div>
                <div class="freight">(含运费：￥{{item.carriage?item.carriage: 0 | thousands}})</div>
              </div>
            </div>
            <div class="state">
              <div>
                <div>{{item.state_show}}</div>
                <NuxtLink :to="{ path: '/user/indent/detail', query: { id: item.id }}">订单详情</NuxtLink>
              </div>
            </div>
            <div class="operation">
              <div>
                <NuxtLink :to="{ path: '/money/pay', query: { id: item.id }}" v-if="item.state === 1"><div class="button"><el-button type="danger" size="mini" round>立即付款</el-button></div></NuxtLink>
                <div v-if="item.state === 3" class="button"><el-button :loading="buttonLoading" type="danger" size="mini" round @click="confirmReceipt(item)">确认收货</el-button></div>
                <div v-if="item.state === 1" class="button"><el-button :loading="buttonLoading" size="mini" round @click="cancelOrder(item)">取消订单</el-button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { getList, cancel, destroy, receipt } from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的订单-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      goodIndentList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        index: '0',
        sort: '-created_at',
      }
    }
  },
  mounted() {
    if($nuxt.$route.query.index){
      this.listQuery.index = $nuxt.$route.query.index
    }
    this.getList()
  },
  methods: {
    async getList(){
      this.loading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([goodIndent]) => {
        this.goodIndentList = goodIndent.data;
        goodIndent.data.forEach(item=>{
          item.goods_list.forEach(items=>{
            if(items.good_sku){
              items.good_sku.product_sku.forEach(item2=>{
                if(items.specification){
                  items.specification+= item2.value + ';'
                }else{
                  items.specification = item2.value + ';'
                }
              })
              items.specification = items.specification.substr(0,items.specification.length-1)
            }
          })
        })
        this.total = goodIndent.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    getReloadList(){
      this.listQuery.page = 1;
      this.getList()
    },
    //取消订单
    cancelOrder(item){
      this.$confirm('是否确认取消订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        cancel(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '取消成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    // 删除订单
    deleteOrder(item){
      this.$confirm('是否确认删除订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        destroy(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    // 确认收货
    confirmReceipt(item){
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        receipt(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  .indent-list{
    .li{
      border: 1px solid #e5e5e5;
      margin-bottom: 20px;
      .details{
        display: flex;
        font-size: 12px;
        .good{
          width: 600px;
          .good-li{
            display: flex;
            padding:10px;
            font-size: 12px;
            border-right-width: 1px;
            border-bottom-width: 1px;
            border-right-style: solid;
            border-bottom-style: solid;
            border-right-color: #e5e5e5;
            border-bottom-color: #e5e5e5;
            a{
              font-size: 12px;
              margin-bottom: 5px;
            }
            .image{
              border: 1px solid #e5e5e5;
              margin-right: 10px;
            }
            .specification{
              color: #999999;
            }
          }
          .good-li:last-child{
            border-bottom: none;
          }
        }
        .total{
          display: flex;
          width: 150px;
          text-align: center;
          border-right: 1px solid #e5e5e5;
          align-items:center;
          justify-content: center;
          .freight{
            color: #999999;
          }
        }
        .state{
          display: flex;
          width: 80px;
          text-align: center;
          border-right: 1px solid #e5e5e5;
          align-items:center;
          justify-content: center;
          div{
            margin-bottom: 5px;
          }
          a:hover{
            color: #fa524c;
          }
        }
        .operation{
          width: 120px;
          display: flex;
          text-align: center;
          align-items:center;
          justify-content: center;
          .button{
            margin-bottom: 5px;
          }
        }
      }
      .top{
        display: flex;
        padding: 10px;
        color: #666;
        font-size: 14px;
        background: #f5f5f5;
        .time{
          margin-right: 20px;
        }
        .odd{
          flex:1;
          span{
            color: #333333;
          }
        }
        .delete{
          cursor:pointer;
        }
        .delete:hover{
          color: #fa524c;
        }
      }
    }
    .navigation{
      margin-bottom: 20px;
      display: flex;
      background: #f5f5f5;
      line-height: 45px;
      padding-left:20px;
      padding-right: 20px;
      font-size: 14px;
      color: #666;
      .good{
        width: 580px;
      }
      .total{
        width: 150px;
        text-align: center;
      }
      .state{
        width: 80px;
        text-align: center;
      }
      .operation{
        width: 120px;
        text-align: center;
      }
    }
  }
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
