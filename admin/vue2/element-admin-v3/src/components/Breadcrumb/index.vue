<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title&&item.meta.breadcrumb!==false" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{
        generateTitle(item.meta.title) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => {
        if (item.name) {
          return true
        }
      })
      const first = matched[0]
      if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
        matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      }
      // 增加创建、详情、保存时面包屑无列表页的问题
      if (matched[matched.length - 1].path.indexOf('Create') !== -1 || matched[matched.length - 1].path.indexOf('Detail') !== -1 || matched[matched.length - 1].path.indexOf('Edit') !== -1) {
        let matchedPath = ''
        let matchedTitle = ''
        if (matched[matched.length - 1].path.indexOf('Create') !== -1) {
          matchedPath = matched[matched.length - 1].path.replace('Create', 'List')
          matchedTitle = matched[matched.length - 1].meta.title.replace('创建', '') + '列表'
        } else if (matched[matched.length - 1].path.indexOf('Detail') !== -1) {
          matchedPath = matched[matched.length - 1].path.replace('Detail', 'List')
          matchedTitle = matched[matched.length - 1].meta.title.replace('详情', '') + '列表'
        } else {
          matchedPath = matched[matched.length - 1].path.replace('Edit', 'List')
          matchedTitle = matched[matched.length - 1].meta.title.replace('保存', '') + '列表'
        }
        matched.splice(matched.length - 1, 0, { path: matchedPath, meta: { title: matchedTitle }})
      }
      this.levelList = matched
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
