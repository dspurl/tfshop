import { create, details, edit } from '@/api/plugin'
import Sortable from 'sortablejs'
export default {
  name: 'PluginDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eidt: false,
      name: '',
      dialogIndexes: false,
      dialogIndexesIndex: '',
      dialogDataTableIndex: '',
      dialogDataTable: false,
      loading: false,
      formLoading: false,
      indexesTemp: {
        name: '',
        type: '',
        synopsis: '',
        field: []
      },
      ruleForm: {
        name: '',
        identification: '',
        db: []
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
        name: '',
        annotation: '',
        indexes: [],
        attribute: [],
        softDeletes: 0,
        timestamps: 1,
        after_end: 1,
        backstage: 1,
        data_table: 1,
        jurisdiction: 1,
        reset: false
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.name = this.$route.query.name
      this.details()
    }
  },
  methods: {
    // 获取插件信息
    details() {
      details(this.name).then((res) => {
        this.ruleForm = res.data
        this.ruleForm.data_table = 1
        this.ruleForm.after_end = 1
        this.ruleForm.backstage = 1
        this.ruleForm.jurisdiction = 1
        this.ruleForm.reset = 0
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
    // 添加数据表
    addDataTable() {
      this.eidt = false
      this.dialogDataTable = true
      this.temp = {
        name: '',
        annotation: '',
        indexes: [],
        attribute: [],
        softDeletes: 0,
        timestamps: 1,
        after_end: 1,
        backstage: 1,
        data_table: 1,
        jurisdiction: 1,
        reset: false
      }
      this.$nextTick(() => {
        this.$refs['dataTableForm'].clearValidate()
        this.setSort()
      })
    },
    // 编辑数据表
    editDataTable(row, index) {
      this.eidt = true
      this.dialogDataTable = true
      this.dialogDataTableIndex = index
      this.temp = row
      this.$nextTick(() => {
        this.setSort()
      })
    },
    // 数据表添加/保存
    dataTableSubmit() {
      this.$refs['dataTableForm'].validate(valid => {
        if (valid) {
          this.dialogDataTable = false
          if (this.dialogDataTableIndex !== '') {
            this.ruleForm.db[this.dialogDataTableIndex] = this.temp
            this.dialogIndexesIndex = ''
          } else {
            this.ruleForm.db.push(this.temp)
          }
        } else {
          this.$message.error('存在未填写信息')
        }
      })
    },
    // 删除索引
    deleteDataTable(index) {
      this.ruleForm.db.splice(index, 1)
    },
    // 添加/编辑索引
    indexesSubmit() {
      this.$refs['indexesForm'].validate(valid => {
        if (valid) {
          this.dialogIndexes = false
          if (this.dialogIndexesIndex !== '') {
            this.temp.indexes[this.dialogIndexesIndex] = this.indexesTemp
            this.dialogIndexesIndex = ''
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
    // 插件提交
    submit() {
      this.formLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.name) {
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
    }
  }
}
