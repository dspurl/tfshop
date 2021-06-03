<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col v-for="l in list" :span="6" :key="l.id">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 20px;">
          <el-image v-if="l.type === 1" :src="l.img" :preview-src-list="listImage" lazy style="height:340px;width: 100%;"/>
          <el-image v-else style="height:340px;width: 100%;"/>
          <div class="name">
            <div class="title">{{ l.depict }}</div>
            <div class="delete">
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(l)"/>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .app-container .name{
    padding:20px;
    display: flex;
    .title{
      flex:1;
    }
  }
  .timeInterval{
    top:-4px;
  }
  .pagination-operation{
    margin-bottom: 80px;
    float:left;
  }
  .pagination-operation .operation{
    margin-left:20px;
    margin-top: 32px;
    font-size: 12px;
    float:left;
    margin-right: 10px;
  }
  .pagination-operation .pagination{
    float:left;
    padding: 0 0;
  }
  .drawing img{
    float:left;
  }
  .drawing .right{
    text-align: left;
    float:left;
    margin-left: 10px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 188px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 188px;
    height: 188px;
    display: block;
  }
</style>

<script>
import { getList, destroy } from '@/api/resource'
import Pagination from '@/components/Pagination'

export default {
  name: 'ResourceList',
  components: { Pagination },
  data() {
    return {
      list: null,
      listImage: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        activeIndex: '1'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const that = this
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        that.listImage = []
        this.list.forEach(function(data) {
          that.listImage.push(data.img)
        })
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(row) { // 删除
      const title = '请确保资源无效后再删除！'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        destroy(row.id).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
      })
    }
  }
}
</script>
