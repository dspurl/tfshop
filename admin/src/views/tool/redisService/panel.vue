<template>
  <div class="app-container">
    <json-viewer
      :value="list"
      :expand-depth="5"
      :copyable="copyable"
      theme="my-awesome-json-theme"
      boxed
      sort/>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .my-awesome-json-theme {
    background: #2d2d2d;
    white-space: nowrap;
    color: #ccc;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;

    .jv-ellipsis {
      color: #999;
      background-color: #eee;
      display: inline-block;
      line-height: 0.9;
      font-size: 0.9em;
      padding: 0px 4px 2px 4px;
      border-radius: 3px;
      vertical-align: 2px;
      cursor: pointer;
      user-select: none;
    }
    .jv-button { color: #49b3ff }
    .jv-key { color: #ccc }
    .jv-item {
      &.jv-array { color: #ccc }
      &.jv-boolean { color: #fc1e70 }
      &.jv-function { color: #067bca }
      &.jv-number { color: #fc1e70 }
      &.jv-object { color: #ccc }
      &.jv-undefined { color: #e08331 }
      &.jv-string {
        color: #42b983;
        word-break: break-word;
        white-space: normal;
      }
    }
    .jv-code {
      .jv-toggle {
        &:before {
          padding: 0px 2px;
          border-radius: 2px;
        }
        &:hover {
          &:before {
            background: #eee;
          }
        }
      }
    }
  }
</style>

<script>
import { panel } from '@/api/redis'
import { getToken } from '@/utils/auth'
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'RedisPanel',
  components: { JsonViewer },
  data() {
    return {
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
      dialogVisible: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: {},
      total: 0,
      textMap: '查看',
      copyable: {
        copyText: '复制',
        copiedText: '复制中'
      },
      imgData: {
        type: 1,
        size: 1024 * 500
      },
      imgProgressPercent: 0,
      loading: false,
      listLoading: false,
      imgProgress: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        activeIndex: '1'
      },
      temp: {},
      jsonData: {},
      rules: {
        name: [
          { required: true, message: '请输入场景名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择场景类型', trigger: 'change' }
        ],
        contents: [
          { required: true, message: '请输入场景用例', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      panel().then(response => {
        this.list = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      } else if (prop === 'time') {
        this.sortByTIME(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleSelect(key, keyPath) {
      this.listQuery.activeIndex = key
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        state: 0,
        sort: '5',
        img: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
