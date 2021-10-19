import { create, details, edit, routes, models, template, jurisdiction, installList } from '@/api/plugin'
import Sortable from 'sortablejs'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import treeTransfer from 'el-tree-transfer'
export default {
  name: 'PluginDetail',
  components: {
    mavonEditor,
    treeTransfer
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateObserverName = (rule, value, callback) => {
      if (!(/^(?!_)([A-Za-z ]+)$/.test(value))) {
        callback(new Error('观察者名称格式有误'))
      } else {
        callback()
      }
    }
    return {
      path: [],
      models: [],
      template: [],
      relyOn: [],
      adminTemplate: [],
      dialogObserver: false,
      dialogRelevance: false,
      dialogRelyOn: false,
      dbEdit: false,
      observerEdit: false,
      name: '',
      dialogIndexes: false,
      dialogIndexesIndex: '',
      dialogRelevanceIndex: '',
      dialogRelyOnIndex: '',
      dialogDataTableIndex: '',
      dialogObserverIndex: '',
      dialogDataTable: false,
      loading: false,
      formLoading: false,
      indexesTemp: {
        name: '',
        type: '',
        synopsis: '',
        field: []
      },
      observerTemp: {
        name: '',
        models: '',
        path: '',
        explain: '',
        reset: false
      },
      relevanceTemp: {
        file: '',
        explain: ''
      },
      relyOnTemp: {
        name: '',
        abbreviation: '',
        versions: '',
        must: false
      },
      versions: '',
      ruleForm: {
        clientTemplate: [],
        adminTemplate: [],
        name: '',
        abbreviation: '',
        old_abbreviation: '',
        instructions: '',
        author: '',
        db: [],
        observer: [],
        describe: '',
        versions: '',
        relevance: [],
        packagingJurisdiction: [],
        routes: false,
        relyOn: []
      },
      rules: {
        name: [
          { required: true, message: '请输入插件名称', trigger: 'blur' }
        ],
        abbreviation: [
          { required: true, message: '请输入插件标识', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入插件简介', trigger: 'blur' }
        ],
        versions: [
          { required: true, message: '请输入插件版本', trigger: 'blur' }
        ]
      },
      dataTableRules: {
        name: [
          { required: true, message: '请输入表名', trigger: 'blur' }
        ],
        annotation: [
          { required: true, message: '请输入表注释', trigger: 'blur' }
        ]
      },
      indexesRules: {
        name: [
          { required: true, message: '请输入表名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择索引类型', trigger: 'change' }
        ],
        field: [
          { required: true, message: '请选择字段', trigger: 'change' }
        ]
      },
      observerRules: {
        name: [
          { required: true, message: '请输入观察者名称', trigger: 'blur' },
          { validator: validateObserverName, trigger: 'blur' }
        ],
        models: [
          { required: true, message: '请选择依赖模型', trigger: 'change' }
        ],
        path: [
          { required: false, message: '请选择可执行路由', trigger: 'change' }
        ],
        explain: [
          { required: true, message: '请输入说明', trigger: 'blur' }
        ]
      },
      relevanceRules: {
        file: [
          { required: true, message: '请输入文件完整路径', trigger: 'blur' }
        ],
        explain: [
          { required: true, message: '请输入说明', trigger: 'blur' }
        ]
      },
      relyOnRules: {
        name: [
          { required: true, message: '请选择插件', trigger: 'blur' }
        ]
      },
      indexesType: [{
        value: 'INDEX',
        label: 'INDEX'
      }, {
        value: 'UNIQUE',
        label: 'UNIQUE'
      }, {
        value: 'SPATIAL',
        label: 'SPATIAL'
      }],
      db: {
        sort: [{
          value: 'utf8_general_ci',
          label: 'utf8_general_ci'
        }, {
          value: 'utf8mb4_unicode_ci',
          label: 'utf8mb4_unicode_ci'
        }],
        attribute: [{
          value: 'BINARY',
          label: 'BINARY'
        }, {
          value: 'UNSIGNED',
          label: 'UNSIGNED'
        }],
        path: [],
        type: [{
          label: '数字',
          options: [{
            value: 'tinyInteger',
            label: 'TINYINT'
          }, {
            value: 'smallInteger',
            label: 'SMALLINT'
          }, {
            value: 'mediumInteger',
            label: 'MEDIUMINT'
          }, {
            value: 'integer',
            label: 'INT'
          }, {
            value: 'bigInteger',
            label: 'BIGINT'
          }]
        }, {
          label: '日期与时间',
          options: [{
            value: 'timestamp',
            label: 'TIMESTAMP'
          }]
        }, {
          label: '文本',
          options: [{
            value: 'char',
            label: 'CHAR'
          }, {
            value: 'string',
            label: 'VARCHAR'
          }, {
            value: 'text',
            label: 'TEXT'
          }, {
            value: 'mediumText',
            label: 'MEDIUMTEXT'
          }, {
            value: 'longText',
            label: 'LONGTEXT'
          }]
        }, {
          label: 'JSON',
          options: [{
            value: 'json',
            label: 'JSON'
          }]
        }]
      },
      temp: {
        fullScreen: false,
        name: '',
        annotation: '',
        indexes: [],
        attribute: [],
        softDeletes: 0,
        timestamps: 1,
        after_end: true,
        backstage: true,
        data_table: true,
        jurisdiction: true,
        client: true,
        reset: true
      },
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        // underline: true, // 下划线
        // strikethrough: true, // 中划线
        // mark: true, // 标记
        // superscript: true, // 上角标
        // subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        // imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        // trash: true, // 清空
        // save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      xssOptions: {
        whiteList: {
          img: ['src', 'alt', 'width', 'height']
        },
        stripIgnoreTagBody: true
      },
      fromData: [],
      oldFromData: [],
      toData: [],
      mode: 'transfer'
    }
  },
  created() {
    if (this.isEdit) {
      this.name = this.$route.query.name
      this.details()
    } else {
      this.getJurisdiction()
    }
    this.getRoutes()
    this.getModels()
    this.getInstallList()
    this.getTemplate('client')
    this.getTemplate('admin')
  },
  methods: {
    // 获取客户端模板列表
    getTemplate(name) {
      template(name).then((res) => {
        if (name === 'admin') {
          this.adminTemplate = res.data
        } else {
          this.template = res.data
        }
      })
    },
    // 获取模型列表
    getModels() {
      models().then((res) => {
        this.models = res.data
      })
    },
    // 获取安装的插件列表
    getInstallList() {
      installList().then((res) => {
        this.relyOn = res.data
      })
    },
    // 获取所有权限
    getJurisdiction() {
      const packagingJurisdiction = this.ruleForm.packagingJurisdiction ? this.ruleForm.packagingJurisdiction : []
      jurisdiction({ packagingJurisdiction: packagingJurisdiction }).then((res) => {
        this.fromData = res.data
      })
    },
    // 获取可执行路由
    getRoutes() {
      routes().then((res) => {
        this.path = res.data
      })
    },
    // 获取插件信息
    details() {
      details(this.name).then((res) => {
        this.ruleForm = res.data
        this.ruleForm.db.forEach(item => {
          if (item.reset) {
            item.reset = false
          }
        })
        this.ruleForm.observer.forEach(item => {
          if (item.reset) {
            item.reset = false
          }
        })
        this.ruleForm.instructions = this.ruleForm.instructions ? this.ruleForm.instructions : ''
        this.ruleForm.packagingJurisdiction = this.ruleForm.packagingJurisdiction ? this.ruleForm.packagingJurisdiction : []
        this.ruleForm.relyOn = this.ruleForm.relyOn ? this.ruleForm.relyOn : []
        this.toData = this.ruleForm.packagingJurisdiction
        this.ruleForm.routes = false
        this.versions = res.data.versions
        this.ruleForm.old_abbreviation = JSON.parse(JSON.stringify(this.ruleForm.abbreviation))
        this.getJurisdiction()
      }).catch(() => {
        this.formLoading = false
      })
    },
    // 增加属性
    addDBAttribute() {
      this.temp.attribute.push({
        name: '',
        type: '',
        length: '',
        default: '',
        sort: 'utf8_general_ci',
        attribute: '',
        is_empty: '',
        AUTO_INCREMENT: '',
        annotation: ''
      })
    },
    // 增加索引
    addDBIndexes() {
      this.dialogIndexes = true
      this.dialogIndexesIndex = ''
      this.indexesTemp = {
        name: '',
        type: '',
        field: []
      }
      this.$nextTick(() => {
        this.$refs['indexesForm'].clearValidate()
      })
    },
    // 删除属性
    deleteDBAttribute(index) {
      this.temp.attribute.splice(index, 1)
    },
    // 删除索引
    deleteIndexes(index) {
      this.temp.indexes.splice(index, 1)
    },
    // 编辑索引
    editIndexes(row, index) {
      this.dialogIndexes = true
      this.dialogIndexesIndex = index
      this.indexesTemp = row
    },
    // 添加观察者
    addObserverTable() {
      this.dialogObserver = true
      this.dialogObserverIndex = ''
      this.observerTemp = {
        name: '',
        models: '',
        path: '',
        explain: '',
        reset: false
      }
      this.$nextTick(() => {
        this.$refs['observerForm'].clearValidate()
      })
    },
    // 添加依赖插件
    addRelyOnTable() {
      this.dialogRelyOn = true
      this.dialogRelyOnIndex = ''
      this.relyOnTemp = {
        name: '',
        abbreviation: '',
        versions: '',
        must: false
      }
      this.$nextTick(() => {
        this.$refs['relyOnForm'].clearValidate()
      })
    },
    // 添加关联文件
    addRelevanceTable() {
      this.dialogRelevance = true
      this.dialogRelevanceIndex = ''
      this.relevanceTemp = {
        file: '',
        explain: ''
      }
      this.$nextTick(() => {
        this.$refs['relevanceForm'].clearValidate()
      })
    },
    // 添加数据表
    addDataTable() {
      this.dbEdit = false
      this.dialogDataTable = true
      this.dialogDataTableIndex = ''
      this.temp = {
        name: '',
        annotation: '',
        indexes: [],
        attribute: [],
        softDeletes: 0,
        timestamps: 1,
        after_end: true,
        backstage: true,
        data_table: true,
        jurisdiction: true,
        client: true,
        reset: true
      }
      this.$nextTick(() => {
        this.$refs['dataTableForm'].clearValidate()
        this.setSort()
      })
    },
    // 编辑数据表
    editDataTable(row, index) {
      this.dbEdit = true
      this.dialogDataTable = true
      this.dialogDataTableIndex = index
      this.temp = row
      this.$nextTick(() => {
        this.setSort()
      })
    },
    // 编辑观察者
    editObserverTable(row, index) {
      this.observerEdit = true
      this.dialogObserver = true
      this.dialogObserverIndex = index
      this.observerTemp = row
    },
    // 编辑关联文件
    editRelevanceTable(row, index) {
      this.relevanceEdit = true
      this.dialogRelevance = true
      this.dialogRelevanceIndex = index
      this.relevanceTemp = row
    },
    // 编辑依赖插件
    editRelyOnTable(row, index) {
      this.relyOnEdit = true
      this.dialogRelyOn = true
      this.dialogRelyOnIndex = index
      this.relyOnTemp = row
    },
    // 观察者添加/保存
    observerSubmit() {
      this.$refs['observerForm'].validate(valid => {
        if (valid) {
          this.dialogObserver = false
          if (this.dialogObserverIndex !== '') {
            this.ruleForm.observer[this.dialogObserverIndex] = this.observerTemp
          } else {
            this.ruleForm.observer.push(this.observerTemp)
          }
        }
      })
    },
    // 关联文件添加/保存
    relevanceSubmit() {
      this.$refs['relevanceForm'].validate(valid => {
        if (valid) {
          this.dialogRelevance = false
          if (this.dialogRelevanceIndex !== '') {
            this.ruleForm.relevance[this.dialogRelevanceIndex] = this.relevanceTemp
          } else {
            this.ruleForm.relevance.push(this.relevanceTemp)
          }
        }
      })
    },
    // 依赖插件添加/保存
    relyOnSubmit() {
      this.$refs['relyOnForm'].validate(valid => {
        if (valid) {
          this.relyOn.map((item) => {
            if (item.name === this.relyOnTemp.name) {
              this.relyOnTemp.abbreviation = item.abbreviation
              this.relyOnTemp.versions = item.versions
            }
          })
          this.dialogRelyOn = false
          if (this.dialogRelyOnIndex !== '') {
            this.ruleForm.relyOn[this.dialogRelyOnIndex] = this.relyOnTemp
          } else {
            this.ruleForm.relyOn.push(this.relyOnTemp)
          }
        }
      })
    },
    // 数据表添加/保存
    dataTableSubmit() {
      this.$refs['dataTableForm'].validate(valid => {
        if (valid) {
          this.dialogDataTable = false
          if (this.dialogDataTableIndex !== '') {
            this.ruleForm.db[this.dialogDataTableIndex] = this.temp
          } else {
            this.ruleForm.db.push(this.temp)
          }
        } else {
          this.$message.error('存在未填写信息')
        }
      })
    },
    // 删除表
    deleteDataTable(index) {
      const title = '是否确认删除该表?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.ruleForm.db.splice(index, 1)
        this.$notify({
          title: this.$t('hint.succeed'),
          message: win,
          type: 'success',
          duration: 2000
        })
      })
    },
    // 删除观察者
    deleteObserverTable(index) {
      const title = '是否确认删除该观察者?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.ruleForm.observer.splice(index, 1)
        this.$notify({
          title: this.$t('hint.succeed'),
          message: win,
          type: 'success',
          duration: 2000
        })
      })
    },
    // 删除关联文件
    deleteRelevanceTable(index) {
      const title = '是否确认删除该关联文件?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.ruleForm.relevance.splice(index, 1)
        this.$notify({
          title: this.$t('hint.succeed'),
          message: win,
          type: 'success',
          duration: 2000
        })
      })
    },
    // 删除依赖插件
    deleteRelyOnTable(index) {
      const title = '是否确认删除该依赖插件?'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.ruleForm.relyOn.splice(index, 1)
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 添加/编辑索引
    indexesSubmit() {
      this.$refs['indexesForm'].validate(valid => {
        if (valid) {
          this.dialogIndexes = false
          if (this.dialogIndexesIndex !== '') {
            this.temp.indexes[this.dialogIndexesIndex] = this.indexesTemp
          } else {
            this.temp.indexes.push(this.indexesTemp)
          }
        }
      })
    },
    // 行拖拽
    setSort() {
      const tbody = document.querySelector('.dragTable .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.temp.attribute.splice(oldIndex, 1)[0]
          _this.temp.attribute.splice(newIndex, 0, currRow)
          const newArray = _this.temp.attribute.slice(0)
          _this.temp.attribute = []
          _this.$nextTick(function() {
            _this.temp.attribute = newArray
          })
        }
      })
    },
    fullScreen(status) {
      this.fullScreen = status
    },
    // 插件提交
    submit() {
      this.formLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.name) {
            if (this.ruleForm.publish && this.versions === this.ruleForm.versions) {
              this.$message.error('已发布的版本无法直接编辑，请修改版本号')
              this.formLoading = false
              return false
            }
            edit(this.ruleForm).then(() => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              setTimeout(this.$router.back(-1), 2000)
            }).catch(() => {
              this.formLoading = false
            })
          } else {
            create(this.ruleForm).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              setTimeout(this.$router.back(-1), 2000)
            }).catch(() => {
              this.formLoading = false
            })
          }
        } else {
          this.formLoading = false
        }
      })
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      this.ruleForm.packagingJurisdiction = toData
      this.$forceUpdate()
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      this.ruleForm.packagingJurisdiction = toData
      this.$forceUpdate()
    }
  }
}
