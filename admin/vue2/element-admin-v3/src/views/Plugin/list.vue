<template>
  <div class="app-container">
    <el-menu :default-active="listQuery.activeIndex" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
      <el-menu-item index="1">本地</el-menu-item>
      <el-menu-item index="2">市场</el-menu-item>
    </el-menu>
    <div v-if="listQuery.activeIndex === '2' && total === 0" class="tip">
      <p>您还没有正确配置开发者密钥，<el-link :underline="false" href="https://dsshoping.dswjcms.com/article/detail?id=38" type="primary" target="_blank">查看帮助</el-link> </p>
    </div>
    <div class="filter-container">
      <div class="condition"/>
      <div class="operation">
        <router-link v-permission="$store.jurisdiction.PlugInCreate" :to="'PlugInCreate'">
          <el-button class="filter-item" type="primary" icon="el-icon-edit">添加插件</el-button>
        </router-link>
        <el-button v-permission="$store.jurisdiction.PlugInCreate" :to="'PlugInCreate'" class="filter-item" type="success" icon="el-icon-refresh" @click="refreshList()">刷新插件列表</el-button>
        <el-popover
          placement="left"
          width="600"
          trigger="click">
          <div>
            <p>1、插件安装需开发人员操作，安装插件前请备份项目及数据库，安装插件可能导致不可逆操作。</p>
            <p>2、插件安装请确保是开发模式下操作，因涉及文件修改、替换操作，需要人为操作环节。</p>
            <p>3、自己创建和下载的插件可以在本地列表中进行管理。</p>
            <p>4、如自己创建的插件并发布到了市场，是会同时存在于本地和市场列表中的，请不要尝试下载市场中的插件，这将导致本地的插件被替换。</p>
            <p>5、本地已安装插件更新步骤：市场更新插件(下载最新插件)->本地升级插件(更新本地插件)。</p>
            <p>6、插件安装后一闪而过的错误是正常现象，因项目文件发生变化，会重新加载，如刷新后还是报错，请重新运行`npm run dev`</p>
          </div>
          <i slot="reference" class="el-icon-question question"/>
        </el-popover>
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
          <div v-if="item.diff_count > 0" class="hint"><i class="el-icon-warning"/>{{ item.diff_count }}个冲突未处理。<el-button type="danger" size="mini" round @click="getDiff(item.name, item.abbreviation)">立即处理</el-button></div>
          <div v-else class="hint-box"/>
        </el-card>
      </div>
    </div>
    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="list"/>
    </div>
    <!-- 冲突-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogDiff" :title="diffTitle" @close="getList">
      <div class="tip">
        <p>以下文件存在冲突，可自行合并，或直接覆盖（直接覆盖可能导致程序无法正常运行）</p>
        <p>合并可以使用专业工具进行比对合并，也可以手动比对</p>
        <p>点击">"可以查看具体冲突的内容</p>
        <p>冲突通过linux diff记录，"---"表示变动前的文件，"+++"表示变动后的文件</p>
        <p>@@ -90,26 +90,6 @@ 如上面内容，代表哪个文件从哪行开始连续多少行，如"-90,26"意思是:变动前的文件第90行开始连续26行</p>
        <p>代码中的"-"代表变动后的文件中删除的代码，"+"代表变动后的文件中增加的代码</p>
      </div>
      <el-table
        v-loading="diffLoading"
        :data="dialogData"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <json-viewer
              :value="scope.row.details"
              :expand-depth="5"
              :copyable="copyable"
              theme="my-awesome-json-theme"
              boxed
              sort/>
          </template>
        </el-table-column>
        <el-table-column
          label="原文件"
          prop="from"/>
        <el-table-column
          label="目标文件"
          prop="to"/>
        <el-table-column
          label="操作"
          align="right"
          width="100">
          <template v-if="scope.row.state === 0" slot-scope="scope">
            <el-popconfirm
              confirm-button-text="已处理"
              cancel-button-text="覆盖"
              icon="el-icon-info"
              icon-color="red"
              title="请选择处理方式？"
              @confirm="handleDiff(scope.row.to, 1)"
              @cancel="handleDiff(scope.row.to, 2)"
            >
              <el-button
                slot="reference"
                :loading="handleDiffLoading"
                size="mini"
                type="primary"
                round>处理</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
