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
      padding: 0 4px 2px 4px;
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
          padding: 0 2px;
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
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'RedisPanel',
  components: { JsonViewer },
  data() {
    return {
      list: {},
      copyable: {
        copyText: '复制',
        copiedText: '复制中'
      },
      listLoading: false
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
    }
  }
}
</script>
