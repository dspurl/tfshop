<template>
	<el-container>
		<el-main>
			<el-card shadow="never">
				<el-tabs v-loading="loading" v-model="activeName">
					<el-tab-pane v-for="(item, index) in list" :key="index" :label="item.name" :name="'tab' + item.id">
						<div v-if="item.remark" class="el-form-item-msg">
							<p>{{ item.remark }}</p>
						</div>
						<el-form :ref="`dataForm${index}`" :model="item" label-width="150px" style="margin-top: 20px;">
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
										<el-input v-if="item3.input_type === 'input'" v-model="item3.value"
												  :maxlength="item3.maxlength" clearable/>
										<div v-else-if="item3.input_type === 'text'">{{ item3.value }}</div>
										<el-input v-else-if="item3.input_type === 'inputShowPassword'"
												  v-model="item3.value" :maxlength="item3.maxlength" show-password
												  clearable/>
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
										<div class="el-form-item-msg">
											<p>{{ item3.remark }}</p>
											<el-tag v-if="item3.keys">{{ item3.keys }}</el-tag>
										</div>
									</el-form-item>
								</template>
								<el-input v-if="item2.input_type === 'input'" v-model="item2.value"
										  :maxlength="item2.maxlength" clearable/>
								<div v-else-if="item2.input_type === 'text'">{{ item2.value }}</div>
								<el-input v-else-if="item2.input_type === 'inputShowPassword'" v-model="item2.value"
										  :maxlength="item2.maxlength" show-password clearable/>
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
								<div class="el-form-item-msg">
									<p>{{ item2.remark }}</p>
									<el-tag v-if="item2.keys">{{ item2.keys }}</el-tag>
								</div>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" :loading="isSaveing" @click="submit(`dataForm${index}`, item)">保存</el-button>
							</el-form-item>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</el-card>
		</el-main>
	</el-container>
</template>
<style lang='scss' scoped>
</style>

<script>
import js from './js/index'

export default js
</script>
