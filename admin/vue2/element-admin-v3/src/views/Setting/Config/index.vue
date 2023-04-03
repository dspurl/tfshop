<template>
  <div class="app-container">
    <el-tabs v-loading="listLoading" v-model="activeName">
      <el-tab-pane v-for="(item, index) in list" :key="index" :label="item.name" :name="'tab' + item.id">
        <div v-if="item.remark" class="tip">
          <p>{{ item.remark }}</p>
        </div>
        <el-form :ref="`dataForm${index}`" :model="item" label-width="200px" style="margin-top: 20px;">
          <el-form-item
            v-for="(item2, index2) in item.children"
            :prop="'children.' + index2 + '.value'"
            :key="index2"
            :label="item2.name"
            :rules="item2.required ? [
              { required: true, message: `请输入${item2.name}`, trigger: ['blur', 'change'] },
            ] : []"
          >
            <template v-if="item2.children">
              <el-form-item
                v-for="(item3, index3) in item2.children"
                :prop="'children.' + index2 + '.children.' + index3 + '.value'"
                :key="index3"
                :label="item3.name"
                :rules="item3.required ? [
                  { required: true, message: `请输入${item3.name}`, trigger: ['blur', 'change'] },
                ] : []"
                style="padding-bottom: 20px;"
              >
                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input v-if="item3.input_type === 'input'" v-model="item3.value" :maxlength="item3.maxlength" clearable/>
                    <div v-else-if="item3.input_type === 'text'">{{ item3.value }}</div>
                    <el-input v-else-if="item3.input_type === 'inputShowPassword'" v-model="item3.value" :maxlength="item3.maxlength" show-password clearable/>
                    <el-switch
                      v-else-if="item3.input_type === 'switch'"
                      v-model="item3.value"
                      :active-text="item3.input_option[1].name"
                      :inactive-text="item3.input_option[0].name"/>
                    <el-time-select
                      v-else-if="item3.input_type === 'timeSelect'"
                      v-model="item3.value"
                      :picker-options="{
                        start: '00:00',
                        step: '00:01',
                        end: '23:59'
                      }"
                      placeholder="选择时间"/>
                    <el-select
                      v-else-if="item3.input_type === 'select'"
                      v-model="item3.value"
                      placeholder="请选择">
                      <el-option
                        v-for="(optionItem, optionIndex) in item3.input_option"
                        :key="optionIndex"
                        :label="optionItem.name"
                        :value="optionItem.value"/>
                    </el-select>
                    <div class="remark">{{ item3.remark }}</div>
                  </el-col>
                  <el-col :span="2">
                    <el-tag>{{ item3.keys }}</el-tag>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
            <el-row v-else :gutter="20">
              <el-col :span="20">
                <el-input v-if="item2.input_type === 'input'" v-model="item2.value" :maxlength="item2.maxlength" clearable/>
                <div v-else-if="item2.input_type === 'text'">{{ item2.value }}</div>
                <el-input v-else-if="item2.input_type === 'inputShowPassword'" v-model="item2.value" :maxlength="item2.maxlength" show-password clearable/>
                <el-switch
                  v-else-if="item2.input_type === 'switch'"
                  v-model="item2.value"
                  :active-text="item2.input_option[1].name"
                  :inactive-text="item2.input_option[0].name"/>
                <el-time-select
                  v-else-if="item2.input_type === 'timeSelect'"
                  v-model="item2.value"
                  :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:59'
                  }"
                  placeholder="选择时间"/>
                <el-select
                  v-else-if="item2.input_type === 'select'"
                  v-model="item2.value"
                  placeholder="请选择">
                  <el-option
                    v-for="(optionItem, optionIndex) in item2.input_option"
                    :key="optionIndex"
                    :label="optionItem.name"
                    :value="optionItem.value"/>
                </el-select>
                <div class="remark">{{ item2.remark }}</div>
              </el-col>
              <el-col :span="2">
                <el-tag>{{ item2.keys }}</el-tag>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(`dataForm${index}`, item)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.remark{
  color: #999999;
}
</style>
<script>
import { getList, edit } from '@/api/config'
export default {
  name: 'ConfigDetail',
  data() {
    return {
      activeName: '',
      listLoading: false,
      list: [],
      sys: {
        dsshop_applySecret: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.activeName = 'tab' + this.list[0].id
        this.listLoading = false
      })
    },
    submitForm(formName, form) { // 更新
      console.log('值', this.$refs[formName])
      this.formLoading = true
      this.$refs[formName][0].validate((valid) => {
        if (valid) {
          edit(form).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    }
  }
}
</script>
