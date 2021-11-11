<template>
  <div v-loading="loading" class="container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="ruleForm">
      <h3>基本信息</h3>
      <el-form-item class="min-input" label="插件名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="20" placeholder="请输入插件名称" clearable/>
      </el-form-item>
      <el-form-item class="min-input" label="插件标识" prop="abbreviation">
        <el-input v-model="ruleForm.abbreviation" maxlength="20" placeholder="请输入插件标识" clearable/>
      </el-form-item>
      <el-form-item class="min-input" label="作者" prop="author">
        <el-input v-model="ruleForm.author" maxlength="20" placeholder="请输入作者" clearable/>
      </el-form-item>
      <el-form-item class="min-input" label="插件简介" prop="describe">
        <el-input v-model="ruleForm.describe" maxlength="200" placeholder="请输入插件简介" clearable/>
      </el-form-item>
      <el-form-item class="min-input" label="支持的客户端模板" prop="client">
        <el-select v-model="ruleForm.clientTemplate" multiple clearable placeholder="请选择">
          <el-option-group
            v-for="group in template"
            :key="group.name"
            :label="group.name">
            <el-option
              v-for="item in group.children"
              :key="item.en"
              :label="item.name"
              :value="group.name + '/' + item.en"/>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item class="min-input" label="支持的后台模板" prop="client">
        <el-select v-model="ruleForm.adminTemplate" multiple clearable placeholder="请选择">
          <el-option-group
            v-for="group in adminTemplate"
            :key="group.name"
            :label="group.name">
            <el-option
              v-for="item in group.children"
              :key="item.en"
              :label="item.name"
              :value="group.name + '/' + item.en"/>
          </el-option-group>
        </el-select>
      </el-form-item>
      <div class="tip">
        <p>1、创建数据库时，会根据支持的客户端自动创建相关的模板</p>
      </div>
      <el-form-item class="min-input" label="使用说明" prop="instructions">
        <mavon-editor :class="{'full-screen': fullScreen }" v-model="ruleForm.instructions" :xss_options="xssOptions" :toolbars="markdownOption" :ishljs="true" code-style="atom-one-dark" placeholder="请输入正文" style="min-width:1000px;" @fullScreen="fullScreen"/>
      </el-form-item>
      <div class="tip">
        <p>1、使用说明支持markdown语法</p>
      </div>
      <el-form-item class="min-input" label="插件版本" prop="versions">
        <el-input v-model="ruleForm.versions" maxlength="20" placeholder="请输入插件版本" clearable/>
      </el-form-item>
      <h3>数据库</h3>
      <div class="tip">
        <p>1、创建的表可以是伪数据表，即不创建数据表，只需要创建一些模板和后端代码</p>
        <p>2、删除插件时，将会删除自动生成的文件，其它非自动生成的文件不会进行删除</p>
        <p>3、创建的插件不会自动生成数据表，需要通过命令行执行`php artisan migrate`，打包好后，其它用户使用时，会自动生成对应的数据表，无需执行命名行</p>
        <p>4、自己添加的路由请带上name属性，name命名格式：admin/client.权限名，如`admin.adminList`</p>
      </div>
      <el-table
        :data="ruleForm.db"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="表名"
          width="200">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="annotation"
          label="表注释"
          width="200">
          <template slot-scope="scope">
            {{ scope.row.annotation }}
          </template>
        </el-table-column>
        <el-table-column
          prop="softDeletes"
          label="软删除"
          width="80">
          <template slot-scope="scope">
            {{ scope.row.softDeletes ? '支持' : '不支持' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="timestamps"
          label="timestamps"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.timestamps ? '支持' : '不支持' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="数据表"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.data_table"
              active-text="生成"
              inactive-text="不生成"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="后端代码"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.after_end"
              active-text="生成"
              inactive-text="不生成"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="后台代码"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.backstage"
              active-text="生成"
              inactive-text="不生成"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="客户端代码"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.client"
              active-text="生成"
              inactive-text="不生成"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="权限"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.jurisdiction"
              active-text="生成"
              inactive-text="不生成"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="是否重置"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.reset"
              active-text="是"
              inactive-text="否"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle @click="editDataTable(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteDataTable(scope.$index)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 10px 0 0 0;" type="success" round @click="addDataTable">新建数据表</el-button>
      <h3>观察者</h3>
      <div class="tip">
        <p>1、如果你的插件涉及到其它插件或需要在某个业务执行前后去做处理，那请用观察者，而不是直接去修改业务代码</p>
      </div>
      <el-table
        :data="ruleForm.observer"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="观察者名称"
          width="300">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="models"
          label="依赖模型"
          width="300">
          <template slot-scope="scope">
            {{ scope.row.models }}
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="可执行路由"
          width="300">
          <template slot-scope="scope">
            {{ scope.row.path }}
          </template>
        </el-table-column>
        <el-table-column
          prop="explain"
          label="说明">
          <template slot-scope="scope">
            {{ scope.row.explain }}
          </template>
        </el-table-column>
        <el-table-column
          prop="reset"
          label="是否重置"
          width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.reset"
              active-text="是"
              inactive-text="否"/>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle @click="editObserverTable(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteObserverTable(scope.$index)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 10px 0 0 0;" type="success" round @click="addObserverTable">新建观察者</el-button>
      <h3>依赖插件</h3>
      <div class="tip">
        <p>1、如果您的插件需要依赖其它插件才可以运作，或是有根据其它插件开发对应的功能，可通过添加依赖插件实现</p>
      </div>
      <el-table
        :data="ruleForm.relyOn"
        style="width: 100%">
        <el-table-column
          prop="file"
          label="依赖的插件">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="explain"
          label="是否必须">
          <template slot-scope="scope">
            {{ scope.row.must ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle @click="editRelyOnTable(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteRelyOnTable(scope.$index)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 10px 0 20px 0;" type="success" round @click="addRelyOnTable">添加依赖插件</el-button>
      <h3>关联文件</h3>
      <div class="tip">
        <p>1、关联文件不能存在相同的文件名或目录名，如客户端和移动端相同，请自行修改</p>
      </div>
      <el-table
        :data="ruleForm.relevance"
        style="width: 100%">
        <el-table-column
          prop="file"
          label="文件">
          <template slot-scope="scope">
            {{ scope.row.file }}
          </template>
        </el-table-column>
        <el-table-column
          prop="explain"
          label="说明">
          <template slot-scope="scope">
            {{ scope.row.explain }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle @click="editRelevanceTable(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteRelevanceTable(scope.$index)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 10px 0 20px 0;" type="success" round @click="addRelevanceTable">添加关联文件</el-button>
      <el-form-item v-if="name" label="是否重置路由" prop="routes">
        <el-switch
          v-model="ruleForm.routes"
          active-text="是"
          inactive-text="否"/>
        <p>重置后将会重新生成后台路由代码、后端路由代码、语言包路由代码</p>
      </el-form-item>
      <el-form-item v-if="name" label="打包权限" prop="packagingJurisdiction">
        <tree-transfer
          :from_data="fromData"
          :to_data="toData"
          :default-props="{label:'label'}"
          :title="['未分配', '已分配']"
          mode="transfer"
          placeholder="请输入关键词进行筛选"
          height="500px"
          filter
          open-all
          style="width: 800px"
          @addBtn="add"
          @removeBtn="remove"/>
        <div class="tip">
          <p>1、如果有设计到后台权限，请配置此处，不然则无需配置</p>
          <p>2、插件权限在卸载的时候，不会对一级权限进行删除，如需要删除，请通过权限管理自行手动删除</p>
          <p>3、配置打包插件所需要的权限，配置后的权限在用户安装插件时会根据该权限进行添加</p>
          <p>4、打包权限为最终插件所需权限，请确保配置正常，不然将导致用户安装插件后无法正常使用插件</p>
        </div>
      </el-form-item>
      <el-form-item class="float-button">
        <el-button :loading="formLoading" type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    <!--新建数据表-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogDataTable" :fullscreen="true" :title="dbEdit ? '编辑数据表': '新建数据表'">
      <el-form ref="dataTableForm" :model="temp" :rules="dataTableRules" class="dataTableForm" label-position="top" label-width="120px">
        <el-form-item class="min-input" label="表名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入表名" maxlength="60" clearable/>
          <p>表名在没有特殊情况下，请在表最后加上s</p>
        </el-form-item>
        <el-form-item class="min-input" label="表注释" prop="annotation">
          <el-input v-model="temp.annotation" placeholder="请输入表注释" maxlength="60" clearable/>
        </el-form-item>
        <el-form-item label="属性" prop="attribute">
          <el-table
            :data="temp.attribute"
            row-key="id"
            style="width: 100%"
            class="dragTable">
            <el-table-column
              prop="name"
              row-key="id"
              label="名字"
              width="180">
              <template slot-scope="scope">
                <el-form-item
                  :rules="{
                    required: true, message: '属性名字不能为空', trigger: 'blur'
                  }"
                  :prop="'attribute.'+scope.$index+'.name'"
                >
                  <el-input v-model="scope.row.name" clearable/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="180">
              <template slot-scope="scope">
                <el-form-item
                  :rules="{
                    required: true, message: '请选择类型', trigger: 'change'
                  }"
                  :prop="'attribute.'+scope.$index+'.type'"
                >
                  <el-select v-model="scope.row.type" placeholder="请选择" filterable clearable>
                    <el-option-group
                      v-for="group in db.type"
                      :key="group.label"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="length"
              label="长度/值"
              width="120">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'attribute.'+scope.$index+'.length'"
                >
                  <el-input v-model="scope.row.length" clearable/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="default"
              label="默认值"
              width="180">
              <template slot-scope="scope">
                <el-form :model="scope.row">
                  <el-form-item prop="default">
                    <el-input v-model="scope.row.default" clearable/>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <!--<el-table-column
              prop="sort"
              label="排序规则"
              width="200">
              <template slot-scope="scope">
                <el-form-item
                  :rules="{
                    required: true, message: '请选择排序规则', trigger: 'change'
                  }"
                  :prop="'attribute.'+scope.$index+'.sort'"
                >
                  <el-select v-model="scope.row.sort" placeholder="请选择" filterable clearable>
                    <el-option
                      v-for="item in db.sort"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>-->
            <el-table-column
              prop="attribute"
              label="属性"
              width="180">
              <template slot-scope="scope">
                <el-form-item>
                  <el-select v-model="scope.row.attribute" placeholder="请选择" filterable clearable>
                    <el-option
                      v-for="item in db.attribute"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="is_empty"
              label="空"
              width="45">
              <template slot-scope="scope">
                <el-form-item prop="is_empty">
                  <el-checkbox v-model="scope.row.is_empty"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="AUTO_INCREMENT"
              label="A_I"
              width="45">
              <template slot-scope="scope">
                <el-form-item prop="AUTO_INCREMENT">
                  <el-checkbox v-model="scope.row.AUTO_INCREMENT"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="annotation"
              label="注释">
              <template slot-scope="scope">
                <el-form-item prop="annotation">
                  <el-input v-model="scope.row.annotation" clearable/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="50"
              fixed="right">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <el-button type="danger" icon="el-icon-delete" circle @click="deleteDBAttribute(scope.$index)"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div class="tip">
            <p>1、表注释如果有参数说明的话，请以下面的格式进行编写[说明:值=值含义-英文简写]，如[是否隐藏:0=否-no,1=是-yes]</p>
            <p>2、表注释的英文简写如果包含多个英文单词的话，请用下划线连接，如full_reduction</p>
            <p>3、名字如果是ID的话，将自动设置主键自增类型</p>
            <p>4、支持拖拽排序</p>
            <p>5、如果字段非必填，请设为空</p>
            <p>6、后台代码：控制器、验证器；数据库代码：数据库迁移文件、模型；客户端代码：client;权限代码：权限分配</p>
          </div>
          <el-button style="margin-top:10px;" type="success" round @click="addDBAttribute">增加属性</el-button>
        </el-form-item>
        <el-form-item class="min-input" label="软删除" prop="softDeletes">
          <el-radio-group v-model="temp.softDeletes">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="min-input" label="timestamps" prop="timestamps">
          <el-radio-group v-model="temp.timestamps">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="索引" prop="indexes">
          <el-table
            :data="temp.indexes"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="键名"
              width="200">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="索引类型"
              width="200">
              <template slot-scope="scope">
                {{ scope.row.type }}
              </template>
            </el-table-column>
            <el-table-column
              prop="field"
              label="字段">
              <template slot-scope="scope">
                {{ scope.row.field }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              fixed="right">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <el-button type="primary" icon="el-icon-edit" circle @click="editIndexes(scope.row)"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <el-button type="danger" icon="el-icon-delete" circle @click="deleteIndexes(scope.$index)"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="margin-top:10px;" type="success" round @click="addDBIndexes">增加索引</el-button>
        </el-form-item>
        <el-form-item label="数据表" prop="data_table">
          <el-switch
            v-model="temp.data_table"
            active-text="生成"
            inactive-text="不生成"/>
          <div>选择生成后，系统将自动生成数据表迁移文件</div>
        </el-form-item>
        <el-form-item label="后端代码" prop="after_end">
          <el-switch
            v-model="temp.after_end"
            active-text="生成"
            inactive-text="不生成"/>
          <div>选择生成后，系统将自动生成控制器、模型、验证器</div>
        </el-form-item>
        <el-form-item label="后台代码" prop="backstage">
          <el-switch
            v-model="temp.backstage"
            active-text="生成"
            inactive-text="不生成"/>
          <div>选择生成后，系统将自动生成后台模板文件</div>
        </el-form-item>
        <el-form-item label="客户端代码" prop="client">
          <el-switch
            v-model="temp.client"
            active-text="生成"
            inactive-text="不生成"/>
          <p>选择生成后，系统将自动生支持的客户端代码;客户端不会自动生成路由文件，所以需要自行添加对应路由;</p>
          <p>发行时，系统会自动将pages目录下以插件标识命名的目录、user目录下以插件标识命名的目录、api目录下以表命名的文件进行打包</p>
        </el-form-item>
        <el-form-item label="权限" prop="jurisdiction">
          <el-switch
            v-model="temp.jurisdiction"
            active-text="生成"
            inactive-text="不生成"/>
          <div>选择生成后，系统将自动创建数据表对应的权限，并为当前用户增加该权限</div>
        </el-form-item>
        <el-form-item v-if="name" label="是否重置" prop="reset">
          <el-switch
            v-model="temp.reset"
            active-text="是"
            inactive-text="否"/>
          <p>1、勾选重置将重新生成所有插件相关文件，如已对部分文件做了修改，请不要勾选</p>
          <p>2、不重置的话，保存后会不将修改后的数据更新到对应的文件中，需要自行在对应文件中手动添加</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="float-button">
        <el-button :loading="formLoading" @click="dialogDataTable = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="dataTableSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加索引-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogIndexes" :title="dialogIndexesIndex === '' ? `新建索引` : `修改索引`">
      <el-form ref="indexesForm" :model="indexesTemp" :rules="indexesRules" label-position="left" label-width="120px">
        <el-form-item label="索引名称" prop="name">
          <el-input v-model="indexesTemp.name" class="min-input" placeholder="请输入索引名称" maxlength="60" clearable/>
        </el-form-item>
        <el-form-item label="索引类型" prop="type">
          <el-select v-model="indexesTemp.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in indexesType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="字段" prop="field">
          <el-select v-model="indexesTemp.field" multiple placeholder="请选择" clearable>
            <el-option
              v-for="item in temp.attribute"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formLoading" @click="dialogIndexes = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="indexesSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加观察者-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogObserver" :title="dialogObserverIndex === '' ? `新建观察者` : `修改观察者`">
      <el-form ref="observerForm" :model="observerTemp" :rules="observerRules" label-position="left" label-width="120px">
        <el-form-item label="观察者名称" prop="name">
          <el-input v-model="observerTemp.name" class="min-input" placeholder="请输入观察者名称" maxlength="60" clearable/>
          <div>观察者名称仅支持英文和空格，最终会解析成类名</div>
        </el-form-item>
        <el-form-item label="依赖模型" prop="models">
          <el-select v-model="observerTemp.models" placeholder="请选择" clearable filterable>
            <el-option
              v-for="(item, index) in models"
              :key="index"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="可执行路由" prop="path">
          <el-select v-model="observerTemp.path" placeholder="请选择" clearable filterable multiple>
            <el-option
              v-for="(item, index) in path"
              :key="index"
              :label="item.uri"
              :value="item.uri">
              <span style="float: left">{{ item.uri }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.explain }}[{{ item.path }}]</span>
            </el-option>
          </el-select>
          <div>为空即不允许路由执行</div>
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="observerTemp.explain" class="min-input" placeholder="请输入说明" type="textarea" maxlength="200" clearable/>
          <div>说明下该观察者的作用</div>
        </el-form-item>
        <el-form-item v-if="name" label="是否重置" prop="reset">
          <el-switch
            v-model="observerTemp.reset"
            active-text="是"
            inactive-text="否"/>
          <p>1、勾选重置将重新生成所有插件相关文件，如已对部分文件做了修改，请不要勾选</p>
          <p>2、不重置的话，保存后会不将修改后的数据更新到对应的文件中，需要自行在对应文件中手动添加</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formLoading" @click="dialogObserver = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="observerSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加关联文件-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogRelevance" :title="dialogRelevanceIndex === '' ? `新建关联文件` : `修改关联文件`">
      <el-form ref="relevanceForm" :model="relevanceTemp" :rules="relevanceRules" label-position="left" label-width="120px">
        <el-form-item label="文件" prop="file">
          <el-input v-model="relevanceTemp.file" class="min-input" placeholder="请输入文件完整路径" maxlength="255" clearable/>
          <div>在发行时会对文件进行校验，如不存在将无法完成发行，格式：/api/app/Providers/AppServiceProvider.php</div>
        </el-form-item>
        <el-form-item label="说明" prop="explain">
          <el-input v-model="relevanceTemp.explain" class="min-input" placeholder="请输入说明" type="textarea" maxlength="200" clearable/>
          <div>说明下该文件的作用</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formLoading" @click="dialogRelevance = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="relevanceSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加依赖插件-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogRelyOn" :title="dialogRelyOnIndex === '' ? `新建依赖插件` : `修改依赖插件`">
      <el-form ref="relyOnForm" :model="relyOnTemp" :rules="relyOnRules" label-position="left" label-width="120px">
        <el-form-item class="min-input" label="插件" prop="name">
          <el-select v-model="relyOnTemp.name" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in relyOn"
              :key="index"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否必须" prop="must">
          <el-switch
            v-model="relyOnTemp.must"
            active-text="是"
            inactive-text="否"/>
          <p>1、设为必须后，使用者必须先安装依赖插件才允许继续操作</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formLoading" @click="dialogRelyOn = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="relyOnSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
  @import "../scss/detail";
</style>
<script>
import js from '../js/detail'
export default js
</script>
