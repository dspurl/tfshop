<template>
  <div>
    <el-dialog :visible.sync="visible" title="商品选取">
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="关键字">
            <el-input v-model="listQuery.title" placeholder="商品标题/商品货号" clearable @input="handleFilter" />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :key="tableKey"
        :data="list"
        height="400"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange">
        <el-table-column label="编号" sortable="custom" prop="id" fixed="left" width="80">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" @change="hasChange(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.resources.img | smallImage(150)" :preview-src-list="[ scope.row.resources.img ]" style="width:80px;height:80px;"/>
          </template>
        </el-table-column>
        <el-table-column label="商品" width="200">
          <template slot-scope="scope">
            <div class="drawing">
              <div class="right">
                <div>{{ scope.row.name }}</div>
                <div v-if="scope.row.price_show.length > 1">¥ {{ scope.row.price_show[0] | 1000 }} - {{ scope.row.price_show[1] | 1000 }}</div>
                <div v-else>¥ {{ scope.row.price_show[0] | 1000 }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.category ? scope.row.category.name : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货号" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.inventory_show }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" sortable="custom" prop="is_show" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.putaway_show }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" sortable="custom" prop="time" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.time ? scope.row.time : '未发布' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" sortable="custom" prop="updated_at" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="total>0" class="pagination-operation">
        <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
.createPost-container{
  padding-bottom: 60px;
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
.avatar-uploaders .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploaders .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icons {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.progress-imgs{
  padding: 5px;
}
.float-button{
  position: fixed;
  bottom: 0px;
  right: 0;
  padding-right: 10%;
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
</style>
<script>
import { getList, detail } from '@/api/good'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLoading: false,
      listLoading: false,
      multipleSelection: [],
      tableKey: 0,
      total: 0,
      visible: false,
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      }
    }
  },
  created() {
  },
  methods: {
    // 显示
    open(mode = 'add') {
      this.mode = mode
      this.visible = true
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    hasChange(row) {
      detail(row.id).then(response => {
        this.$emit('success', response.data.goods)
        this.visible = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
