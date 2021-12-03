<template>
	<el-dialog title="角色权限设置" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-tabs tab-position="top">
			<el-tab-pane label="菜单权限">
				<div class="treeMain">
					<el-tree ref="menu" node-key="name" :data="menu.list" :default-checked-keys="menu.checked" :props="menu.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="部门权限">
				<div class="treeMain">
					<el-tree ref="group" node-key="name" :data="group.list" :default-checked-keys="group.checked" :props="group.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="类型权限">
				<div class="treeMain">
					<el-tree ref="type" node-key="name" :data="type.list" :default-checked-keys="type.checked" :props="type.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="控制台">
				<el-form label-width="100px" label-position="left">
					<el-form-item label="控制台视图">
						<el-select v-model="dashboard" placeholder="请选择">
							<el-option v-for="item in dashboardOptions" :key="item.value" :label="item.label" :value="item.value">
								<span style="float: left">{{ item.label }}</span>
								<span style="float: right; color: #8492a6; font-size: 12px">{{ item.views }}</span>
							</el-option>
						</el-select>
						<div class="el-form-item-msg">用于控制角色登录后控制台的视图</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				visible: false,
				isSaveing: false,
				menu: {
					list: [],
					checked: ["test", "system", "user", "role"],
					props: {
						label: (data)=>{
							return data.meta.title
						}
					}
				},
				group: {
					list: [],
					checked: [],
					props: {}
				},
				type: {
					list: [],
					checked: [],
					props: {}
				},
				dashboard: "0",
				dashboardOptions: [
					{
						value: '0',
						label: '数据统计',
						views: 'stats'

					},
					{
						value: '1',
						label: '工作台',
						views: 'work'
					},
				]
			}
		},
		mounted() {
			this.getMenu();
			this.getGroup();
			this.getType();
		},
		methods: {
			open(){
				this.visible = true;
			},
			submit(){
				this.isSaveing = true;
				setTimeout(()=>{
					this.isSaveing = false;
					this.visible = false;
					this.$message.success("操作成功")
					this.$emit('success')
				},1000)
			},
			async getMenu(){
				var res = await this.$API.system.menu.list.get();
				this.menu.list = res.data;
			},
			getGroup(){
				this.group.list = [
					{label: 'JL00'},
					{label: 'LP01'},
					{label: 'LP07'},
					{label: 'SL01'},
					{label: 'TL06'},
					{label: 'TL09'},
					{label: 'YP07'}
				];
			},
			getType(){
				this.type.list = [
					{label: '原料采购'},
					{label: '厂内互供'},
					{label: '炼销订单'},
					{label: '化工统销订单'},
					{label: '移库单'},
					{label: '自销订单'},
				];
			}
		}
	}
</script>

<style scoped>
	.treeMain {height:280px;overflow: auto;border: 1px solid #dcdfe6;margin-bottom: 10px;}
</style>
