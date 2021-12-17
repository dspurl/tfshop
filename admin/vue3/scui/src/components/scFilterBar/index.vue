<!--
 * @Descripttion: 过滤器V2
 * @version: 2.2
 * @Author: sakuya
 * @Date: 2021年7月30日14:48:41
 * @LastEditors: sakuya
 * @LastEditTime: 2021年11月5日09:33:07
-->

<template>
	<div class="sc-filterBar">
		<slot :filterLength="filterObjLength" :openFilter="openFilter">
			<el-badge :value="filterObjLength" type="danger" :hidden="filterObjLength <= 0">
				<el-button size="small" icon="el-icon-filter" @click="openFilter"></el-button>
			</el-badge>
		</slot>

		<el-drawer :title="$t('filterBar.index.title')" v-model="drawer" :size="650" append-to-body>
			<el-container v-loading="saveLoading">
				<el-main style="padding:0">
					<el-tabs class="root">
						<el-tab-pane lazy>
							<template #label>
								<div class="tabs-label">{{ $t('filterBar.index.project') }}</div>
							</template>
							<el-scrollbar>
								<el-main class="nopadding">
									<div class="sc-filter-main">
										<h2>{{ $t('filterBar.index.conditionTitle') }}</h2>
										<div v-if="filter.length <= 0" class="nodata">{{ $t('filterBar.index.conditionNoData') }}</div>
										<table v-else>
											<colgroup>
												<col />
												<col />
												<col v-if="showOperator" />
												<col />
												<col />
											</colgroup>
											<tr v-for="(item,index) in filter" :key="index">
												<td>
													<el-tag size="medium">{{ index + 1 }}</el-tag>
												</td>
												<td>
													<py-select
														v-model="item.field"
														:options="fields"
														:placeholder="$t('filterBar.index.field')"
														filterable
														@change="fieldChange(item)"
													></py-select>
												</td>
												<td v-if="showOperator">
													<el-select v-model="item.operator" :placeholder="$t('filterBar.index.operator')">
														<el-option
															v-for="ope in item.field.operators || operator"
															:key="ope.value"
															:label="ope.label"
															:value="ope.value"
														></el-option>
													</el-select>
												</td>
												<td>
													<el-input
														v-if="!item.field.type"
														v-model="item.value"
														:placeholder="$t('general.pleaseSelect') + ' ' + $t('filterBar.index.field')"
														disabled
													></el-input>
													<!-- 输入框 -->
													<el-input
														v-if="item.field.type == 'text'"
														v-model="item.value"
														:placeholder="item.field.placeholder || $t('general.pleaseInput')"
													></el-input>
													<!-- 下拉框 -->
													<el-select
														v-if="item.field.type == 'select'"
														v-model="item.value"
														:placeholder="item.field.placeholder || $t('general.pleaseSelect')"
														filterable
														:multiple="item.field.extend.multiple"
														:loading="item.selectLoading"
														@visible-change="visibleChange($event, item)"
														:remote="item.field.extend.remote"
														:remote-method="(query) => { remoteMethod(query, item) }"
													>
														<el-option
															v-for="field in item.field.extend.data"
															:key="field.value"
															:label="field.label"
															:value="field.value"
														></el-option>
													</el-select>
													<!-- 日期 -->
													<el-date-picker
														v-if="item.field.type == 'date'"
														v-model="item.value"
														type="date"
														value-format="YYYY-MM-DD"
														:placeholder="item.field.placeholder || ($t('general.pleaseSelect') + ' ' + $t('form.date'))"
														style="width: 100%;"
													></el-date-picker>
													<!-- 日期范围 -->
													<el-date-picker
														v-if="item.field.type == 'daterange'"
														v-model="item.value"
														type="daterange"
														value-format="YYYY-MM-DD HH:mm:ss"
														:start-placeholder="$t('form.startDate')"
														:end-placeholder="$t('form.endDate')"
														style="width: 100%;"
													></el-date-picker>
													<!-- 日期时间 -->
													<el-date-picker
														v-if="item.field.type == 'datetime'"
														v-model="item.value"
														type="datetime"
														value-format="YYYY-MM-DD HH:mm:ss"
														:placeholder="item.field.placeholder || ($t('general.pleaseSelect') + ' ' + $t('form.date'))"
														style="width: 100%;"
													></el-date-picker>
													<!-- 日期时间范围 -->
													<el-date-picker
														v-if="item.field.type == 'datetimerange'"
														v-model="item.value"
														type="datetimerange"
														value-format="YYYY-MM-DD HH:mm:ss"
														:start-placeholder="$t('form.startDate')"
														:end-placeholder="$t('form.endDate')"
														style="width: 100%;"
													></el-date-picker>
													<!-- 开关 -->
													<el-switch
														v-if="item.field.type == 'switch'"
														v-model="item.value"
														active-value="1"
														inactive-value="0"
													></el-switch>
													<!-- 标签 -->
													<el-select
														v-if="item.field.type == 'tags'"
														v-model="item.value"
														multiple
														filterable
														allow-create
														default-first-option
														:no-data-text="$t('general.ack')"
														:placeholder="item.field.placeholder || $t('general.pleaseInput')"
													></el-select>
												</td>
												<td>
													<el-icon class="del" @click="delFilter(index)">
														<el-icon-delete />
													</el-icon>
												</td>
											</tr>
										</table>
										<el-button
											type="text"
											icon="el-icon-plus"
											@click="addFilter"
										>{{ $t('filterBar.index.add') }}</el-button>
									</div>
								</el-main>
							</el-scrollbar>
						</el-tab-pane>
						<el-tab-pane lazy>
							<template #label>
								<div class="tabs-label">{{ $t('filterBar.common.title') }}</div>
							</template>
							<el-scrollbar>
								<my
									ref="my"
									:data="myFilter"
									:filterName="filterName"
									:filterAuthRule="filterAuthRule"
									@selectMyfilter="selectMyfilter"
								></my>
							</el-scrollbar>
						</el-tab-pane>
					</el-tabs>
				</el-main>
				<el-footer>
					<el-button
						type="primary"
						@click="ok"
						:disabled="filter.length <= 0"
					>{{ $t('filterBar.index.immediately') }}</el-button>
					<el-button v-if="data.id" type="primary" plain @click="saveMy('my')">{{ $t("general.save") }}</el-button>
					<el-button
						type="primary"
						plain
						@click="saveMy('my')"
						:disabled="filter.length <= 0"
					>{{ $t('filterBar.index.saveMy') }}</el-button>
					<el-button
						type="primary"
						plain
						@click="saveMy('all')"
						:disabled="filter.length <= 0"
					>{{ $t('filterBar.index.saveAll') }}</el-button>
					<el-button @click="clear">{{ $t('filterBar.index.empty') }}</el-button>
				</el-footer>
			</el-container>
		</el-drawer>
	</div>
</template>

<script>
import config from "@/config/filterBar"
import pySelect from './pySelect'
import my from './my'

export default {
	name: 'filterBar',
	components: {
		pySelect,
		my
	},
	props: {
		filterName: { type: String, default: "" },
		filterAuthRule: { type: String, default: "" },
		showOperator: { type: Boolean, default: true },
		options: { type: Object, default: () => { } }
	},
	data() {
		return {
			drawer: false,
			operator: config.operator,
			fields: this.options,
			filter: [],
			myFilter: [],
			filterObjLength: 0,
			saveLoading: false,
			data: {
				id: ''
			}
		}
	},
	computed: {
		filterObj() {
			const obj = {}
			this.filter.forEach((item) => {
				obj[item.field.value] = this.showOperator ? `${item.value}${config.separator}${item.operator}` : `${item.value}`
			})
			return obj
		}
	},
	mounted() {
		//默认显示的过滤项
		this.fields.forEach((item) => {
			if (item.selected) {
				this.filter.push({
					field: item,
					operator: item.operator || 'include',
					value: ''
				})
			}
		})
	},
	methods: {
		//打开过滤器
		openFilter() {
			this.drawer = true
		},
		//增加过滤项
		addFilter() {
			if (this.fields.length <= 0) {
				this.$message.warning(this.$t('filterBar.index.enothingmpty'));
				return false
			}
			const filterNum = this.fields[this.filter.length] || this.fields[0]
			this.filter.push({
				field: filterNum,
				operator: filterNum.operator || 'include',
				value: ''
			})
		},
		//删除过滤项
		delFilter(index) {
			this.filter.splice(index, 1)
		},
		//过滤项字段变更事件
		fieldChange(tr) {
			let oldType = tr.field.type
			tr.field.type = ''
			this.$nextTick(() => {
				tr.field.type = oldType
			})
			tr.operator = tr.field.operator || 'include'
			tr.value = ''
		},
		//下拉框显示事件处理异步
		async visibleChange(isopen, item) {
			if (isopen && item.field.extend.request && !item.field.extend.remote) {
				item.selectLoading = true;
				try {
					var data = await item.field.extend.request()
				} catch (error) {
					console.log(error);
				}
				item.field.extend.data = data;
				item.selectLoading = false;
			}
		},
		//下拉框显示事件处理异步搜索
		async remoteMethod(query, item) {
			if (query !== '') {
				item.selectLoading = true;
				try {
					var data = await item.field.extend.request(query);

				} catch (error) {
					console.log(error);
				}
				item.field.extend.data = data;
				item.selectLoading = false;
			} else {
				item.field.extend.data = [];
			}
		},
		//选择常用过滤
		selectMyfilter(item) {
			//常用过滤回显当前过滤项
			this.filter = []
			this.fields.forEach((field) => {
				var filterValue = item.data[field.value]
				if (filterValue) {
					var operator = filterValue.split("|")[1]
					var value = filterValue.split("|")[0]
					if (field.type == 'select' && field.extend.multiple) {
						value = value.split(",")
					} else if (field.type == 'daterange') {
						value = value.split(",")
					}
					this.filter.push({
						field: field,
						operator: operator,
						value: value
					})
				}
			})
			this.filterObjLength = Object.keys(item.data).length
			this.$emit('filterChange', item.data)
			this.data = item
			this.drawer = false
		},
		//立即过滤
		ok() {
			this.filterObjLength = this.filter.length
			this.$emit('filterChange', this.filterObj)
			this.drawer = false
		},
		//保存常用
		saveMy(type) {
			this.$prompt(this.$t('filterBar.index.prompt.title'), this.$t('filterBar.index.prompt.inputTitle'), {
				inputPlaceholder: this.$t('filterBar.index.prompt.inputPlaceholder'),
				inputPattern: /\S/,
				inputErrorMessage: this.$t('filterBar.index.prompt.inputErrorMessage'),
				inputValue: this.data.id ? this.data.title : ''
			})
				.then(async ({ value }) => {
					this.saveLoading = true
					let saveObj = {
						title: value,
						filterObj: this.filterObj
					}
					if (this.data.id) {
						saveObj.id = this.data.id
					}
					try {
						var save = await config.saveMy(this.filterAuthRule, saveObj, type)
					} catch (error) {
						this.saveLoading = false
						console.log(error);
						return false
					}
					if (!save) {
						return false
					}
					if (this.data.id) {
						this.$message.success(`${this.filterName} ${this.$t("general.saveSuccessfully")}`)
						this.$refs.my.getMyfilter()
					} else {
						this.myFilter.push(saveObj)
						this.$message.success(`${this.filterName} ${this.$t("filterBar.index.succeed")}`)
					}

					this.saveLoading = false
				})
				.catch(() => {
					//
				})
		},
		//清空过滤
		clear() {
			this.filter = []
			this.filterObjLength = 0
			this.$emit('filterChange', this.filterObj)
		}
	}
}
</script>

<style scoped>
.tabs-label {
	padding: 0 20px;
}

.nodata {
	height: 46px;
	line-height: 46px;
	margin: 15px 0;
	border: 1px dashed #e6e6e6;
	color: #999;
	text-align: center;
	border-radius: 3px;
}

.sc-filter-main {
	padding: 20px;
	border-bottom: 1px solid #e6e6e6;
	background: #fff;
}
.sc-filter-main h2 {
	font-size: 12px;
	color: #999;
	font-weight: normal;
}
.sc-filter-main table {
	width: 100%;
	margin: 15px 0;
}
.sc-filter-main table tr {
}
.sc-filter-main table td {
	padding: 5px 10px 5px 0;
}
.sc-filter-main table td:deep(.el-input .el-input__inner) {
	vertical-align: top;
}
.sc-filter-main table td .el-select {
	display: block;
}
.sc-filter-main table td .el-date-editor.el-input {
	display: block;
	width: 100%;
}
.sc-filter-main table td .del {
	background: #fff;
	color: #999;
	width: 32px;
	height: 32px;
	line-height: 32px;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	cursor: pointer;
}
.sc-filter-main table td .del:hover {
	background: #f56c6c;
	color: #fff;
}

.root {
	display: flex;
	height: 100%;
	flex-direction: column;
}
.root:deep(.el-tabs__header) {
	margin: 0;
}
.root:deep(.el-tabs__content) {
	flex: 1;
	background: #f6f8f9;
}
.root:deep(.el-tabs__content) .el-tab-pane {
	overflow: auto;
	height: 100%;
}

[data-theme="dark"] .root:deep(.el-tabs__content) {
	background: none;
}
[data-theme="dark"] .sc-filter-main {
	background: none;
	border-color: var(--el-border-color-base);
}
[data-theme="dark"] .sc-filter-main table td .del {
	background: none;
}
[data-theme="dark"] .sc-filter-main table td .del:hover {
	background: #f56c6c;
}
[data-theme="dark"] .nodata {
	border-color: var(--el-border-color-base);
}
</style>
