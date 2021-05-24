<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link :to="'PlugInCreate'">
        <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="插件名称">
        <template slot-scope="scope">
          <div>
            {{ scope.row.name }}
            <el-tag
              v-if="scope.row.local"
              type="info"
              effect="dark">
              未发布
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="插件缩写">
        <template slot-scope="scope">
          <span>{{ scope.row.abbreviation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件描述">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件地址">
        <template slot-scope="scope">
          <span v-if="scope.row.local">本地</span>
          <a v-else :href="scope.row.url" target="_blank" >{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="插件版本">
        <template slot-scope="scope">
          <span v-if="scope.row.local">{{ scope.row.versions }}</span>
          <span v-else >{{ scope.row.locality_versions ? scope.row.locality_versions : '未安装' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新版本">
        <template slot-scope="scope">
          <span>{{ scope.row.versions }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <template v-if="scope.row.local">
            <router-link :to="{ path: 'PlugInEdit', query: { name: scope.row.abbreviation }}">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button type="primary" icon="el-icon-edit" circle/>
              </el-tooltip>
            </router-link>
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
    </el-table>
  </div>
</template>
<style lang='scss' scoped>
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
