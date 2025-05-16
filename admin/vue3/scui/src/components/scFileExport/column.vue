
<template>
	<el-table ref="table" :data="columnData" row-key="prop" style="width: 100%" border>
	    <el-table-column prop="" label="排序" width="60">
			<el-tag disable-transitions class="move" style="cursor: move;"><el-icon style="cursor: move;"><el-icon-d-caret/></el-icon></el-tag>
		</el-table-column>
	    <el-table-column prop="label" label="列名">
			<template #default="scope">
				<el-tag round disable-transitions :effect="scope.row.hide?'light':'dark'" :type="scope.row.hide?'info':''">{{ scope.row.label }}</el-tag>
			</template>
		</el-table-column>
	    <el-table-column prop="hide" label="显示" width="60">
			<template #default="scope">
				<el-switch v-model="scope.row.hide" size="small" :active-value="false" :inactive-value="true"/>
			</template>
		</el-table-column>
	  </el-table>
</template>

<script>
	import Sortable from 'sortablejs'

	export default {
		emits: ['success'],
		props: {
			column: { type: Array, default: () => [] }
		},
		data() {
			return {
				columnData: this.column
			}
		},
		mounted() {
			this.rowDrop()
		},
		methods: {
			rowDrop(){
				const _this = this
				const tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody')
				Sortable.create(tbody, {
					handle: ".move",
					animation: 200,
					ghostClass: "ghost",
					onEnd({ newIndex, oldIndex }) {
						const tableData = _this.columnData
						const currRow = tableData.splice(oldIndex, 1)[0]
						tableData.splice(newIndex, 0, currRow)
					}
				})
			}
		}
	}
</script>
