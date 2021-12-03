<template>
	<el-main>
		<el-alert title="感谢Vue3.0版本的vue.draggable.next拖拽组件 https://github.com/SortableJS/vue.draggable.next" type="success" style="margin-bottom:20px;"></el-alert>
		<div class="dragList">
			<draggable v-model="listA" animation="200" item-key="id" group="people">
				<template #item="{ element }">
					<div class="item">{{element.text}}</div>
				</template>
			</draggable>
		</div>
		<div class="dragList">
			<draggable v-model="listB" animation="200" item-key="id" group="people">
				<template #item="{ element }">
					<div class="item">{{element.text}}</div>
				</template>
			</draggable>
		</div>
	</el-main>
</template>

<script>
	import draggable from 'vuedraggable'
	export default {
		name: 'drag',
		components: {
			draggable
		},
		data() {
			return {
				listA: [
					{
						id: 1,
						text: 'A1'
					},
					{
						id: 2,
						text: 'A2'
					},
					{
						id: 3,
						text: 'A3'
					},
					{
						id: 4,
						text: 'A4'
					},
					{
						id: 5,
						text: 'A5'
					},
					{
						id: 6,
						text: 'A6'
					},
					{
						id: 7,
						text: 'A7'
					},
					{
						id: 8,
						text: 'A8'
					},
					{
						id: 9,
						text: 'A9'
					}
				],
				listB: [
					{
						id: 1,
						text: 'B1'
					},
					{
						id: 2,
						text: 'B2'
					},
					{
						id: 3,
						text: 'B3'
					},
					{
						id: 4,
						text: 'B4'
					},
					{
						id: 5,
						text: 'B5'
					},
					{
						id: 6,
						text: 'B6'
					},
					{
						id: 7,
						text: 'B7'
					},
					{
						id: 8,
						text: 'B8'
					},
					{
						id: 9,
						text: 'B9'
					}
				]
			}
		}
	}
</script>

<style scoped>
	.dragList {overflow: auto;}
	.item {cursor: move;float: left;background: #fff;width:100px;height: 100px;line-height: 100px;text-align: center;margin:0 15px 15px 0;border: 1px solid #e6e6e6;}
	.dragList .sortable-ghost {
		opacity: 0.5;
	}
</style>
