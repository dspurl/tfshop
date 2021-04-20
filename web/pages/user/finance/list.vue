<template>
  <div class="box">
    <div class="user-title">我的账单</div>
    <div class="padding-top-20">
      <el-tabs v-model="listQuery.type" @tab-click="getReloadList">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="收入" name="1"></el-tab-pane>
        <el-tab-pane label="支出" name="2"></el-tab-pane>
      </el-tabs>
      <div class="indent-list">
        <el-table
          :data="moneyLogList"
          ref="table"
          border
          v-loading="loading"
          class="table">
          <el-table-column
            label="说明">
            <template slot-scope="scope">
              {{scope.row.remark}}
            </template>
          </el-table-column>
          <el-table-column
            prop="type_show"
            label="类型"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作金额"
            width="120">
            <template slot-scope="scope">
              {{scope.row.money_show | thousands}}
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="操作日期"
            width="180">
          </el-table-column>
        </el-table>
      </div>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { getList } from '@/api/moneyLog'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的账单-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      moneyLogList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        month:'',
        type: 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      this.loading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([goodIndent]) => {
        this.moneyLogList = goodIndent.paginate.data;
        this.total = goodIndent.paginate.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    getReloadList(){
      this.listQuery.page = 1;
      this.getList()
    },
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
            color: $font-color-main;
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
          color: $font-color-main;
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
