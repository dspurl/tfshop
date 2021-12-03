<template>
	<el-main>
		<el-card shadow="never" header="过滤器">
			<scFilterBar filterName="filterName" :options="options" @filterChange="change">
				<template #default="{filterLength, openFilter}">
					<el-badge :value="filterLength" type="danger" :hidden="filterLength<=0">
						<el-button size="small" icon="el-icon-filter" @click="openFilter"></el-button>
					</el-badge>
				</template>
			</scFilterBar>
		</el-card>
		<el-alert title="SCUI 独创的过滤条Filterbar,可配置不同类型的过滤字段,以及异步获取数据,在@/config/filterBar.js中可以更改运算符以及其他配置,操作上方过滤条查看下方change事件的回调,在表格查询的场景下非常合适" type="success" style="margin:20px 0;"></el-alert>
		<el-card shadow="never" header="返回值">
			<pre>{{ filterData }}</pre>
		</el-card>
	</el-main>
</template>

<script>
	import scFilterBar from '@/components/scFilterBar';

	export default {
		name: 'filterBar',
		components: {
			scFilterBar
		},
		data() {
			return {
				filterData : {},
				defaultFilter : [],
				options: [
					{
						label: '订单号',
						value: 'id',
						type: 'text',
						selected: true,
						placeholder: '请输入订单号'
					},
					{
						label: '类型',
						value: 'type',
						type: 'select',
						operator: '=',
						selected: true,
						placeholder: '请选择类型',
						extend: {
							data:[
								{
									label: "选项1",
									value: "1"
								},
								{
									label: "选项2",
									value: "2"
								}
							]
						}
					},
					{
						label: '类型(多选)',
						value: 'type2',
						type: 'select',
						operator: '=',
						placeholder: '请选择类型',
						extend: {
							multiple: true,
							data:[
								{
									label: "选项1",
									value: "1"
								},
								{
									label: "选项2",
									value: "2"
								}
							]
						}
					},
					{
						label: '通知(异步)',
						value: 'noticeType',
						type: 'select',
						operator: '=',
						placeholder: '请选择通知类型',
						extend: {
							request: async () => {
								var list = await this.$API.system.dic.get.get()
								return list.data.map(item => {
									return {
										label: item.label,
										value: item.value
									}
								})
							}
						}
					},
					{
						label: '通知(远程搜索)',
						value: 'noticeType2',
						type: 'select',
						operator: '=',
						placeholder: '请输入关键词后检索',
						extend: {
							remote: true,
							request: async (query) => {
								var data = {
									keyword: query,
								}
								var list = await this.$API.system.dic.get.get(data)
								return list.data.map(item => {
									return {
										label: item.label,
										value: item.value
									}
								})
							}
						}
					},
					{
						label: '关键词(标签)',
						value: 'tags',
						type: 'tags',
						operator: 'include',
						operators: [
							{
								label: '包含',
								value: 'include',
							},
							{
								label: '不包含',
								value: 'notinclude',
							}
						]
					},
					{
						label: '开关',
						value: 'switch',
						type: 'switch',
						operator: '='
					},
					{
						label: '日期单选',
						value: 'date',
						type: 'date',
						operator: '=',
						operators: [
							{
								label: '等于',
								value: '=',
							},
							{
								label: '不等于',
								value: '!=',
							}
						]
					},
					{
						label: '日期范围',
						value: 'date2',
						type: 'daterange'
					}
				]
			}
		},
		methods: {
			change(data){
				this.filterData = data;
			}
		}
	}
</script>

<style>
</style>
