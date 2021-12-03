<template>
	<el-container>
		<el-main class="nopadding">
			<el-calendar v-model="toDay">
				<template #dateCell="{data}">
					<div class="calendar-item">
						<h2>{{ data.day.split('-')[2] }}</h2>
						<div v-if="getData(data.day) && data.type=='current-month'" class="calendar-item-info">
							<p><el-progress :percentage="getData(data.day).plan" :show-text="false"></el-progress></p>
							<p><el-progress :percentage="getData(data.day).complete" status="success" :show-text="false"></el-progress></p>
						</div>
					</div>
				</template>
			</el-calendar>
		</el-main>
		<el-aside style="width: 400px;border-left: 1px solid #e6e6e6;">
			<el-container>
				<el-header>
					<h2 class="dayTitle"><el-icon><el-icon-calendar /></el-icon>{{day}}</h2>
				</el-header>
				<el-main>
					<div class="task-list">
						<template v-if="dayItem">
							<el-card shadow="hover" v-for="task in dayItem.tasks" :key="task.id" :class="stateMap[task.state]">
								<h2>{{task.title}}</h2>
								<div class="task-bottom">
									<div class="tags">
										<el-tag type="info" size="mini">#{{task.id}}</el-tag>
										<el-tag v-if="task.state=='open'" type="info" size="mini">{{task.state}}</el-tag>
										<el-tag v-if="task.state=='complete'" type="success" size="mini">{{task.state}}</el-tag>
										<el-tag v-if="task.state=='timeout'" type="danger" size="mini">{{task.state}}</el-tag>
									</div>
									<el-avatar :size="20" :src="task.avatar"></el-avatar>
								</div>
							</el-card>
						</template>
						<template v-else>
							<el-empty description="无工作任务" :image-size="100"></el-empty>
						</template>
					</div>
				</el-main>
			</el-container>
		</el-aside>
	</el-container>
</template>

<script>
	export default {
		name: 'calendar',
		data(){
			return {
				stateMap: {
					open: "open",
					complete: "complete",
					timeout: "timeout"
				},
				toDay: new Date(this.demoDay()),
				data: {
					[this.demoDay()]: {
						plan: 80,
						complete: 66,
						tasks: [
							{
								id: "3601",
								title: "vite2 on demand loading popconfirm style missing",
								avatar: "img/avatar.jpg",
								state: "complete"
							},
							{
								id: "3602",
								title: "Switch prevent switching invalid",
								avatar: "img/avatar.jpg",
								state: "complete"
							},
							{
								id: "3603",
								title: "The use of paging in vue3 is inconsistent with the official UI display",
								avatar: "img/avatar.jpg",
								state: "timeout"
							}
						]
					},
					[this.demoDay(1)]: {
						plan: 80,
						complete: 0,
						tasks: [
							{
								id: "3604",
								title: "el-switch @change is auto triggered when page load",
								avatar: "img/avatar.jpg",
								state: "open"
							}
						]
					},
					[this.demoDay(2)]: {
						plan: 80,
						complete: 0,
						tasks: [
							{
								id: "3605",
								title: "locale plugin problem happen in production mode when install element-plus on demand",
								avatar: "img/avatar.jpg",
								state: "open"
							},
							{
								id: "3606",
								title: "table uses fixed=right, which leads to the dislocation of hover style",
								avatar: "img/avatar.jpg",
								state: "open"
							}
						]
					}
				}
			}
		},
		computed: {
			day(){
				return this.$TOOL.dateFormat(this.toDay,"yyyy-MM-dd");
			},
			dayItem(){
				return this.getData(this.day)
			}
		},
		methods: {
			getData(date){
				return this.data[date]
			},
			demoDay(n=0){
				var curDate = new Date()
				var oneDayTime = 24*60*60*1000
				var rDate = new Date(curDate.getTime() + (oneDayTime*n) )
				return this.$TOOL.dateFormat(rDate, "yyyy-MM-dd");
			}
		}
	}
</script>

<style scoped>
	.calendar-item h2 {font-size: 14px;}
	.calendar-item-info {margin-top: 15px;}
	.calendar-item-info p {margin-top: 5px;}

	.task-list .el-card {margin-bottom: 15px;border-left: 5px solid #ddd;cursor: pointer;}

	.task-list .el-card.open {border-color: #ddd;}
	.task-list .el-card.complete {border-color: #67C23A;}
	.task-list .el-card.timeout {border-color: #f56c6c;}

	.task-list h2 {font-size: 14px;font-weight: normal;}
	.task-bottom {display: flex;justify-content: space-between;align-items: center;margin-top: 10px;}
	.task-bottom .tags .el-tag {margin-right: 5px;}
	.dayTitle {font-size: 14px;display: flex;align-items: center;}
	.dayTitle i {color: #999;margin-right: 10px;}
</style>
