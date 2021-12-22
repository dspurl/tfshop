<template>
  <el-container>
    <el-aside width="200px" v-loading="showGrouploading">
      <el-container>
        <el-main class="nopadding">
          <el-menu
            :default-active="search.activeIndex"
            class="el-menu-demo"
            mode="vertical"
            @select="handleSelect"
            clearable
          >
            <el-menu-item index="1">本地插件</el-menu-item>
            <el-menu-item index="2">插件市场</el-menu-item>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header>
        <div class="left-panel">
          <el-button v-auth="['AdminCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
        </div>
      </el-header>
      <el-main class="nopadding">
        <el-scrollbar ref="scrollbar" v-loading="listLoading">
          <el-empty v-if="list.length == 0" description="无数据" :image-size="80"></el-empty>
          <el-alert
            v-if="list.length === 0 && search.activeIndex === '2'"
            title="您还没有正确配置开发者密钥，访问链接了解如何配置：https://dsshoping.dswjcms.com/article/detail?id=38"
            type="warning"
            center
            show-icon
          ></el-alert>
          <div class="goods">
            <div v-for="(item, index) in list" :key="index" class="goods-item">
              <el-card :body-style="{ padding: '0px' }">
                <div>
                  <el-image v-if="item.img" :src="item.img" class="image" fit="cover">
                    <template #error>
                      <div class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </template>
                  </el-image>
                  <div v-else class="image">{{ item.name }}</div>
                </div>
                <div class="item-info">
                  <div class="title">
                    <div class="name">{{ item.name }}({{ item.abbreviation }})</div>
                  </div>
                  <div class="generalize">{{ item.describe }}</div>
                  <div class="tag">
                    <template v-if="search.activeIndex === '2'">
                      <el-tag v-if="item.state === 1" type="success" size="mini" effect="dark">已下载</el-tag>
                      <el-tag v-else-if="item.state === 2" size="mini" effect="dark">已安装</el-tag>
                      <el-tag
                        v-else-if="item.state === 3"
                        type="danger"
                        size="mini"
                        effect="dark"
                      >已卸载</el-tag>
                      <el-tag v-else type="info" size="mini" effect="dark">未下载</el-tag>
                    </template>
                    <el-tag v-if="item.local" class="right" type="info" size="mini">本地</el-tag>
                  </div>
                  <div v-if="search.activeIndex === '2'" class="statistics">
                    <div class="statistics-item">
                      <i class="el-icon-view" />
                      {{ $TOOL.groupSeparator(item.pv) }}
                    </div>
                    <div class="statistics-item">
                      <i class="el-icon-download" />
                      {{ $TOOL.groupSeparator(item.download_amount) }}
                    </div>
                    <div class="statistics-item">
                      <i class="el-icon-chat-dot-round" />
                      {{ $TOOL.groupSeparator(item.comment_amount) }}
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <a :title="item.author" :href="item.author_url" class="usrname">
                    <el-avatar :size="26" :src="item.portrait" />
                    <div class="name">{{ item.author }}</div>
                  </a>
                  <div class="category">{{ item.versions }}</div>
                  <div
                    class="category"
                  >{{ category[item.category] ? category[item.category] : '插件' }}</div>
                </div>
                <div class="operation">
                  <template v-if="search.activeIndex === '1'">
                    <template v-if="item.local">
                      <router-link :to="{ path: 'PlugInEdit', query: { name: item.abbreviation } }">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                          <el-button type="primary" icon="el-icon-edit" circle />
                        </el-tooltip>
                      </router-link>
                      <template v-if="!item.publish">
                        <el-tooltip class="item" effect="dark" content="发布" placement="top-start">
                          <el-button
                            :loading="formLoading"
                            class="button"
                            type="success"
                            icon="el-icon-position"
                            circle
                            @click="handlePublish(item.abbreviation)"
                          />
                        </el-tooltip>
                      </template>
                      <template v-else>
                        <el-tooltip class="item" effect="dark" content="下载" placement="top-start">
                          <el-button
                            :loading="formLoading"
                            class="button"
                            type="warning"
                            icon="el-icon-download"
                            circle
                            @click="handleDownload(item.abbreviation)"
                          />
                        </el-tooltip>
                      </template>

                      <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click="handleDelete(item.abbreviation)"
                        />
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <el-tooltip
                        v-if="!item.locality_versions || item.is_delete"
                        class="item"
                        effect="dark"
                        content="安装"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="primary"
                          icon="el-icon-share"
                          circle
                          @click="handleInstall(item.abbreviation)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-else-if="item.locality_versions && item.versions > item.locality_versions"
                        class="item"
                        effect="dark"
                        content="升级"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="primary"
                          icon="el-icon-upload"
                          circle
                          @click="handleInstall(item.abbreviation, 1)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.locality_versions && !item.is_delete"
                        class="item"
                        effect="dark"
                        content="卸载插件"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="primary"
                          icon="el-icon-delete"
                          circle
                          @click="handleUninstall(item.abbreviation)"
                        />
                      </el-tooltip>
                    </template>
                  </template>
                  <template v-else>
                    <!-- 市场-->
                    <template v-if="item.local">
                      <a :href="item.url" target="_blank">
                        <el-tooltip class="item" effect="dark" content="访问" placement="top-start">
                          <el-button
                            :loading="formLoading"
                            class="button"
                            icon="el-icon-link"
                            circle
                          />
                        </el-tooltip>
                      </a>
                    </template>
                    <template v-else>
                      <a :href="item.url" target="_blank">
                        <el-tooltip class="item" effect="dark" content="访问" placement="top-start">
                          <el-button
                            :loading="formLoading"
                            class="button"
                            icon="el-icon-link"
                            circle
                          />
                        </el-tooltip>
                      </a>
                      <a :href="item.log_url" target="_blank">
                        <el-tooltip class="item" effect="dark" content="更新记录" placement="top-start">
                          <el-button
                            :loading="formLoading"
                            class="button"
                            icon="el-icon-date"
                            circle
                          />
                        </el-tooltip>
                      </a>
                      <el-tooltip
                        v-if="item.state === 0"
                        class="item"
                        effect="dark"
                        content="下载"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="primary"
                          icon="el-icon-download"
                          circle
                          @click="handleUpdatePack(item)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.state === 2 && item.is_publish"
                        class="item"
                        effect="dark"
                        content="下载开发版"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="primary"
                          icon="el-icon-s-platform"
                          circle
                          @click="handleUpdatePack(item, 1)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.state === 1"
                        class="item"
                        effect="dark"
                        content="安装"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="success"
                          icon="el-icon-share"
                          circle
                          @click="handleInstall(item.abbreviation)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.update"
                        class="item"
                        effect="dark"
                        content="更新"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="warning"
                          icon="el-icon-upload"
                          circle
                          @click="handleUpdatePack(item)"
                        />
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.state === 2"
                        class="item"
                        effect="dark"
                        content="卸载插件"
                        placement="top-start"
                      >
                        <el-button
                          :loading="formLoading"
                          class="button"
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click="handleUninstall(item.abbreviation)"
                        />
                      </el-tooltip>
                    </template>
                  </template>
                </div>
                <div v-if="item.diff_count > 0" class="hint">
                  <i class="el-icon-warning" />
                  {{ item.diff_count }}个冲突未处理。
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    @click="getDiff(item.name, item.abbreviation)"
                  >立即处理</el-button>
                </div>
                <div v-else class="hint-box" />
              </el-card>
            </div>
          </div>
          <div class="scTable-page" v-if="!hidePagination">
            <div class="scTable-pagination">
              <el-pagination
                v-if="!hidePagination"
                background
                :small="true"
                :layout="paginationLayout"
                :total="total"
                :page-size="search.limit"
                v-model:currentPage="search.page"
                @current-change="paginationChange"
              ></el-pagination>
            </div>
            <div class="scTable-do" v-if="!hideDo">
              <el-button @click="handleFilter" icon="el-icon-refresh" circle style="margin-left:15px"></el-button>
            </div>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>

  <save-dialog
    v-auth="['AdminCreate', 'AdminEdit']"
    v-if="dialog.save"
    ref="saveDialog"
    @success="handleSuccess"
    @closed="dialog.save = false"
    :close-on-click-modal="false"
  ></save-dialog>
</template>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
