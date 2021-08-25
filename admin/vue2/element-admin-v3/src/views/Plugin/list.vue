<template>
  <div class="app-container">
    <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
      <el-menu-item index="1">本地</el-menu-item>
      <!--<el-menu-item index="2">市场</el-menu-item>-->
    </el-menu>
    <!--<div class="tip">
      <p>自己创建和下载的插件可以在本地列表中进行管理</p>
      <p>如自己创建的插件并发布到了市场，是会同时存在于本地和市场列表中的</p>
      <p>本地已安装插件更新步骤：市场更新插件->本地升级插件</p>
    </div>-->
    <div class="filter-container">
      <!--      <el-button class="filter-item" type="success" icon="el-icon-refresh-right" @click="getList()">刷新列表</el-button>-->
      <div class="condition"/>
      <div class="operation">
        <router-link v-permission="$store.jurisdiction.PlugInCreate" :to="'PlugInCreate'">
          <el-button class="filter-item" type="primary" icon="el-icon-edit">添加插件</el-button>
        </router-link>
      </div>
    </div>
    <!-- 商品列表-->
    <div v-loading="listLoading" class="goods">
      <div v-for="(item, index) in list" :key="index" class="goods-item">
        <el-card :body-style="{ padding: '0px' }">
          <div>
            <el-image
              v-if="item.img"
              :src="item.img"
              class="image"
              fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"/>
              </div>
            </el-image>
            <div v-else class="image">
              {{ item.name }}
            </div>
          </div>
          <div class="item-info">
            <div class="title">
              <div class="name">{{ item.name }}({{ item.abbreviation }})</div>
            </div>
            <div class="generalize">{{ item.describe }}</div>
            <div class="tag">
              <template v-if="listQuery.activeIndex === '2'">
                <el-tag v-if="item.state === 1" type="success" size="mini" effect="dark">已下载</el-tag>
                <el-tag v-else-if="item.state === 2" size="mini" effect="dark">已安装</el-tag>
                <el-tag v-else-if="item.state === 3" type="danger" size="mini" effect="dark">已卸载</el-tag>
                <el-tag v-else type="info" size="mini" effect="dark">未下载</el-tag>
              </template>
              <el-tag v-if="item.local" class="right" type="info" size="mini">本地</el-tag>
            </div>
            <div v-if="listQuery.activeIndex === '2'" class="statistics">
              <div class="statistics-item">
                <i class="el-icon-view"/>
                {{ item.pv | numberThousandCarry }}
              </div>
              <div class="statistics-item">
                <i class="el-icon-download"/>
                {{ item.download_amount | numberThousandCarry }}
              </div>
              <div class="statistics-item">
                <i class="el-icon-chat-dot-round"/>
                {{ item.comment_amount | numberThousandCarry }}
              </div>
            </div>
          </div>
          <div class="bottom">
            <a :title="item.author" :href="item.author_url" class="usrname">
              <el-avatar :size="26" :src="item.portrait"/>
              <div class="name">{{ item.author }}</div>
            </a>
            <div class="category">{{ item.versions }}</div>
            <div class="category">{{ category[item.category] ? category[item.category] : '插件' }}</div>
          </div>
          <div class="operation">
            <template v-if="listQuery.activeIndex === '1'">
              <template v-if="item.local">
                <router-link v-permission="$store.jurisdiction.PlugInEdit" :to="{ path: 'PlugInEdit', query: { name: item.abbreviation }}">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <el-button type="primary" icon="el-icon-edit" circle/>
                  </el-tooltip>
                </router-link>
                <el-tooltip v-permission="$store.jurisdiction.PlugInPublish" v-if="!item.publish" :loading="butLoading" class="item" effect="dark" content="发布" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="success" icon="el-icon-position" circle @click="handlePublish(item.abbreviation)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInDownload" v-else :loading="butLoading" class="item" effect="dark" content="下载" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="warning" icon="el-icon-download" circle @click="handleDownload(item.abbreviation)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInDestroy" class="item" effect="dark" content="删除" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="danger" icon="el-icon-delete" circle @click="handleDelete(item.abbreviation)"/>
                </el-tooltip>
              </template>
              <template v-else>
                <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" v-if="!item.locality_versions || item.is_delete" :loading="butLoading" class="item" effect="dark" content="安装" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="primary" icon="el-icon-share" circle @click="handleInstall(item.abbreviation)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInUpdate" v-else-if="item.locality_versions && item.versions > item.locality_versions" :loading="butLoading" class="item" effect="dark" content="升级" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="primary" icon="el-icon-upload" circle @click="handleInstall(item.abbreviation, 1)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInUninstall" v-if="item.locality_versions && !item.is_delete" :loading="butLoading" class="item" effect="dark" content="卸载插件" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="primary" icon="el-icon-delete" circle @click="handleUninstall(item.abbreviation)"/>
                </el-tooltip>
              </template>
            </template>
            <template v-else>
              <!-- 市场-->
              <template v-if="item.local">
                <a :href="item.url" target="_blank">
                  <el-tooltip :loading="butLoading" class="item" effect="dark" content="访问" placement="top-start">
                    <el-button :loading="formLoading" class="button" icon="el-icon-link" circle/>
                  </el-tooltip>
                </a>
              </template>
              <template v-else>
                <a :href="item.url" target="_blank">
                  <el-tooltip :loading="butLoading" class="item" effect="dark" content="访问" placement="top-start">
                    <el-button :loading="formLoading" class="button" icon="el-icon-link" circle/>
                  </el-tooltip>
                </a>
                <a :href="item.log_url" target="_blank">
                  <el-tooltip :loading="butLoading" class="item" effect="dark" content="更新记录" placement="top-start">
                    <el-button :loading="formLoading" class="button" icon="el-icon-date" circle/>
                  </el-tooltip>
                </a>
                <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" v-if="item.state === 0" :loading="butLoading" class="item" effect="dark" content="下载" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="primary" icon="el-icon-download" circle @click="handleUpdatePack(item)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" v-if="item.state === 2 && item.is_publish" :loading="butLoading" class="item" effect="dark" content="下载开发版" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="primary" icon="el-icon-s-platform" circle @click="handleUpdatePack(item, 1)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" v-if="item.state === 1" :loading="butLoading" class="item" effect="dark" content="安装" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="success" icon="el-icon-share" circle @click="handleInstall(item.abbreviation)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInUpdate" v-if="item.update" :loading="butLoading" class="item" effect="dark" content="更新" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="warning" icon="el-icon-upload" circle @click="handleUpdatePack(item)"/>
                </el-tooltip>
                <el-tooltip v-permission="$store.jurisdiction.PlugInUninstall" v-if="item.state === 2" :loading="butLoading" class="item" effect="dark" content="卸载插件" placement="top-start">
                  <el-button :loading="formLoading" class="button" type="danger" icon="el-icon-delete" circle @click="handleUninstall(item.abbreviation)"/>
                </el-tooltip>
              </template>
            </template>
          </div>
        </el-card>
      </div>
    </div>
    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="list"/>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
