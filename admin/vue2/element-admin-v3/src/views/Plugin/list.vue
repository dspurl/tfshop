<template>
  <div class="app-container">
    <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
      <el-menu-item index="1">本地</el-menu-item>
      <el-menu-item index="2">市场</el-menu-item>
    </el-menu>
    <div class="filter-container">
      <!--      <el-button class="filter-item" type="success" icon="el-icon-refresh-right" @click="getList()">刷新列表</el-button>-->
      <div class="condition">
        筛选条件
      </div>
      <div class="operation">
        <router-link v-permission="$store.jurisdiction.PlugInCreate" :to="'PlugInCreate'">
          <el-button class="filter-item" type="primary" icon="el-icon-edit">添加插件</el-button>
        </router-link>
      </div>
    </div>
    <div class="tip">
      <p>自己创建和下载的插件可以在本地列表中进行管理</p>
      <p>如自己创建的插件并发布到了市场，是会同时存在于本地和市场列表中的</p>
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
                123
              </div>
              <div class="statistics-item">
                <i class="el-icon-download"/>
                123
              </div>
              <div class="statistics-item">
                <i class="el-icon-chat-dot-round"/>
                123
              </div>
            </div>
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
              <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" :loading="butLoading" class="item" effect="dark" content="下载" placement="top-start">
                <el-button :loading="formLoading" class="button" type="primary" icon="el-icon-download" circle @click="handleInstall(item.abbreviation)"/>
              </el-tooltip>
              <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" :loading="butLoading" class="item" effect="dark" content="安装" placement="top-start">
                <el-button :loading="formLoading" class="button" type="success" icon="el-icon-share" circle @click="handleInstall(item.abbreviation)"/>
              </el-tooltip>
              <el-tooltip v-permission="$store.jurisdiction.PlugInUpdate" :loading="butLoading" class="item" effect="dark" content="升级" placement="top-start">
                <el-button :loading="formLoading" class="button" type="warning" icon="el-icon-upload" circle @click="handleInstall(item.abbreviation, 1)"/>
              </el-tooltip>
              <el-tooltip v-permission="$store.jurisdiction.PlugInUninstall" :loading="butLoading" class="item" effect="dark" content="卸载插件" placement="top-start">
                <el-button :loading="formLoading" class="button" type="danger" icon="el-icon-delete" circle @click="handleUninstall(item.abbreviation)"/>
              </el-tooltip>
            </template>
          </div>
        </el-card>
      </div>
    </div>
    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="list"/>
    </div>
    <!-- 商品列表-->
    <!--<el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="插件名称" width="300">
        <template slot-scope="scope">
          <div>
            {{ scope.row.name }}
            <el-tag
              v-if="scope.row.local"
              type="info"
              effect="dark">
              本地
            </el-tag>
            <el-tag
              v-if="scope.row.publish"
              effect="dark">
              已发布
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="插件缩写" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.abbreviation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件地址" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.local">本地</span>
          <a v-else :href="scope.row.url" target="_blank" >{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="插件版本" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.local">{{ scope.row.versions }}</span>
          <span v-else >{{ scope.row.locality_versions ? scope.row.locality_versions : '未安装' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新版本" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.versions }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件描述">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.local">
            <router-link v-permission="$store.jurisdiction.PlugInEdit" :to="{ path: 'PlugInEdit', query: { name: scope.row.abbreviation }}">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button type="primary" icon="el-icon-edit" circle/>
              </el-tooltip>
            </router-link>
            <el-tooltip v-permission="$store.jurisdiction.PlugInPublish" v-if="!scope.row.publish" :loading="butLoading" class="item" effect="dark" content="发布" placement="top-start">
              <el-button :loading="formLoading" type="success" icon="el-icon-position" circle @click="handlePublish(scope.row.abbreviation)"/>
            </el-tooltip>
            <el-tooltip v-permission="$store.jurisdiction.PlugInDownload" v-else :loading="butLoading" class="item" effect="dark" content="下载" placement="top-start">
              <el-button :loading="formLoading" type="warning" icon="el-icon-download" circle @click="handleDownload(scope.row.abbreviation)"/>
            </el-tooltip>
            <el-tooltip v-permission="$store.jurisdiction.PlugInDestroy" class="item" effect="dark" content="删除" placement="top-start">
              <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.abbreviation)"/>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip v-permission="$store.jurisdiction.PlugInInstall" v-if="!scope.row.locality_versions || scope.row.is_delete" :loading="butLoading" class="item" effect="dark" content="安装" placement="top-start">
              <el-button :loading="formLoading" type="primary" icon="el-icon-share" circle @click="handleInstall(scope.row.abbreviation)"/>
            </el-tooltip>
            <el-tooltip v-permission="$store.jurisdiction.PlugInUpdate" v-else-if="scope.row.locality_versions && scope.row.versions > scope.row.locality_versions" :loading="butLoading" class="item" effect="dark" content="升级" placement="top-start">
              <el-button :loading="formLoading" type="primary" icon="el-icon-upload" circle @click="handleInstall(scope.row.abbreviation, 1)"/>
            </el-tooltip>
            <el-tooltip v-permission="$store.jurisdiction.PlugInUninstall" v-if="scope.row.locality_versions && !scope.row.is_delete" :loading="butLoading" class="item" effect="dark" content="卸载插件" placement="top-start">
              <el-button :loading="formLoading" type="primary" icon="el-icon-delete" circle @click="handleUninstall(scope.row.abbreviation)"/>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>-->
  </div>
</template>
<style lang='scss' scoped>
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
