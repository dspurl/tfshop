<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in list" :key="item.id">
				<el-card class="task task-item" shadow="hover">
					<h2>{{item.title}}</h2>
					<ul>
						<li>
							<h4>执行目录</h4>
							<p>{{item.path}}</p>
						</li>
						<li>
							<h4>编译方式</h4>
							<p>{{item.way}}</p>
						</li>
						<li>
							<h4>最后编译时间</h4>
							<p>{{item.time}}</p>
						</li>
					</ul>
					<div class="bottom">
						<div class="state">
							<el-tag v-if="item.state=='1'" size="small">准备就绪</el-tag>
							<el-tag v-if="item.state=='-1'" size="small" type="info">停用</el-tag>
						</div>
						<div class="handler">
							<el-popconfirm title="确定立即执行吗？" @confirm="run(item)">
								<template #reference>
									<el-button type="primary" icon="el-icon-caret-right" circle></el-button>
								</template>
							</el-popconfirm>
							<el-dropdown trigger="click">
								<el-button type="primary" icon="el-icon-more" circle plain></el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item @click="edit(item)">编辑</el-dropdown-item>
										<el-dropdown-item @click="logs(item)">日志</el-dropdown-item>
										<el-dropdown-item @click="del(item)" divided>删除</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24">
				<el-card class="task task-add" shadow="never" @click="add">
					<el-icon><el-icon-plus /></el-icon>
					<p>添加计划任务</p>
				</el-card>
			</el-col>
		</el-row>
	</el-main>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

	<el-drawer title="计划任务日志" v-model="dialog.logsVisible" :size="600" direction="rtl" destroy-on-close>
		<logs></logs>
	</el-drawer>
</template>

<script>
	import saveDialog from './save'
	import logs from './logs'

	export default {
		name: 'CompileBuild',
		components: {
			saveDialog,
			logs
		},
		provide() {
			return {
				list: this.list
			}
		},
		data() {
			return {
				dialog: {
					save: false,
					logsVisible: false
				},
				list: [
					{
						id: "1",
						title: "scui管理后台",
						way: "vue",
						path: "admin/vue3/scui",
						handler: "cleanUpCacheHandler",
						cron: "59 59 23 * * ? *",
						time: "2022-10-24 12:00:00",
						state: "1"
					},
					{
						id: "2",
						title: "mallCook平台",
						way: "vue",
						path: "client/uniApp/mallCook/platform",
						handler: "cleanUpCacheHandler",
						cron: "59 59 23 * * ? *",
						time: "2022-10-24 12:00:00",
						state: "1"
					},
					{
						id: "3",
						title: "mallCook模板",
						way: "vue",
						path: "client/uniApp/mallCook/template",
						handler: "cleanUpCacheHandler",
						cron: "59 59 23 * * ? *",
						time: "2022-10-24 12:00:00",
						state: "1"
					}
				]
			}
		},
		mounted() {

		},
		methods: {
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			edit(task){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(task)
				})
			},
			del(task){
				this.$confirm(`确认删除 ${task.title} 计划任务吗？`,'提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).then(() => {
					this.list.splice(this.list.findIndex(item => item.id === task.id), 1)
				}).catch(() => {
					//取消
				})
			},
			logs(){
				this.dialog.logsVisible = true
			},
			run(task){
				this.$message.success(`已成功执行计划任务：${task.title}`)
			},
			//本地更新数据
			handleSuccess(data, mode){
				if(mode=='add'){
					data.id = new Date().getTime()
					this.list.push(data)
				}else if(mode=='edit'){
					this.list.filter(item => item.id===data.id ).forEach(item => {
						Object.assign(item, data)
					})
				}
			}
		}
	}
</script>

<style scoped>
	.task {height: 320px;}
	.task-item h2 {font-size: 15px;color: #3c4a54;padding-bottom:15px;}
	.task-item li {list-style-type:none;margin-bottom: 10px;}
	.task-item li h4 {font-size: 12px;font-weight: normal;color: #999;}
	.task-item li p {margin-top: 5px;}
	.task-item .bottom {border-top: 1px solid #EBEEF5;text-align: right;padding-top:10px;display: flex;justify-content: space-between;align-items: center;}

	.task-add {display: flex;flex-direction: column;align-items: center;justify-content: center;text-align: center;cursor: pointer;color: #999;}
	.task-add:hover {color: #409EFF;}
	.task-add i {font-size: 30px;}
	.task-add p {font-size: 12px;margin-top: 20px;}

	.dark .task-item .bottom {border-color: var(--el-border-color-light);}
</style>
