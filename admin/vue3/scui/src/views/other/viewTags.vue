<template>
	<el-main>
		<el-card shadow="never" header="打开">
			<el-button type="primary" plain @click="open1">打开个人信息</el-button>
			<el-button type="primary" plain @click="open2">打开后执行</el-button>
			<el-alert title="打开后执行原理: 路由push时,在当前路由对象中插入一个特殊标识, 在目标视图中beforeRouteEnter获取判断是否需要执行特殊方法" style="margin-top: 20px;"></el-alert>
		</el-card>
		<el-card shadow="never" header="刷新" style="margin-top: 15px;">
			<el-button type="primary" plain @click="refresh1">刷新当前</el-button>
		</el-card>
		<el-card shadow="never" header="关闭" style="margin-top: 15px;">
			<el-button type="primary" plain @click="close1">关闭当前</el-button>
			<el-button type="primary" plain @click="close2">关闭其他</el-button>
			<el-button type="primary" plain @click="close3">关闭后执行</el-button>
		</el-card>
		<el-card shadow="never" header="设置" style="margin-top: 15px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="input" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" plain @click="set1">设置标题</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="never" header="整页路由" style="margin-top: 15px;">
			<el-button type="primary" plain @click="fullpage">fullpage</el-button>
			<el-alert title="变更路由的层级关系,向上推至顶级达到在layout视图中显示. 只需要在路由中设置 meta.fullpage 即可" style="margin-top: 20px;"></el-alert>
		</el-card>
	</el-main>
</template>

<script>
	import useTabs from '@/utils/useTabs'

	export default {
		name: 'viewTags',
		data() {
			return {
				input: "newTabName"
			}
		},
		mounted() {

		},
		methods: {
			open1(){
				this.$router.push('/usercenter')
			},
			open2(){
				this.$router.push('/usercenter')
				this.$route.is = true
			},
			refresh1(){
				useTabs.refresh()
			},
			close1(){
				useTabs.close()
			},
			close2(){
				useTabs.closeOther()
			},
			close3(){
				useTabs.closeNext((tags)=>{
					//回调返回所有标签的数组，这里其实是需要判断是否含有'/usercenter'，含有再操作的，这里为了演示就直接打开了。
					console.log(tags)
					this.$router.push('/usercenter')
					this.$route.is = true
				})
			},
			set1(){
				useTabs.setTitle(this.input)
			},
			fullpage(){
				this.$router.push('/other/fullpage')
			}
		}
	}
</script>

<style>
</style>
