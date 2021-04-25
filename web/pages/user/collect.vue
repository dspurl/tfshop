<template>
  <div class="box">
    <div class="user-title">我的收藏</div>
    <div class="padding-top-20" v-loading="loading">
      <div class="recommend">
        <div class="list">
          <div class="li" v-for="(item, index) in collectList" :key="index">
            <el-card class="card" shadow="never">
              <NuxtLink :to="{ path: '/product/detail', query: { id: item.good_id }}">
                <el-image
                  class="image"
                  :src="item.good.resources.img | smallImage(200)"
                  fit="cover"
                  lazy/>
                <div class="name">{{item.good.name}}</div>
              </NuxtLink>
              <div class="delete" title="删除">
                <i @click.stop="destroy(item.id)" class="iconfont dsshop-shanchu"></i>
              </div>
            </el-card>
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
import {getList, destroy} from '@/api/collect'
export default {
  layout: 'user',
  head () {
    return {
      title: '我的收藏-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      collectList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at'
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
      ]).then(([collectData]) => {
        this.collectList = collectData.data;
        this.total = collectData.total;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    destroy(id){
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroy(id).then(response => {
          this.handleFilter();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {

        })
      }).catch(() => {
      })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
  }
}
</script>
<style lang='scss' scoped>
  .operation{
    margin-top:20px;
    display: flex;
    .pagination{
      margin-left:5px;
      padding:0 0;
    }
  }
  .recommend{
    .list{
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .li{
        cursor:pointer;
        width: 20%;
        .card{
          position: relative;
          margin: 0 5px 5px 0;
          .image{
            width: 147px;
            height: 147px;
          }
          .name{
            font-size: 14px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .delete{
            position: absolute;
            top:2px;
            right: 2px;
            z-index: 10;
            .iconfont{
              color: #fa524c;
              font-size: 18px;
            }
          }
        }
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
