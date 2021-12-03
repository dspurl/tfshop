<template>
	<el-main>
		<el-card shadow="never" header="v-auth 高精度权限控制">
			<el-button v-auth="'user.add'" type="primary">v-auth="'user.add'"</el-button>
			<el-button v-auth="['user.no','user.add']" type="primary">v-auth="['user.no','user.add']"</el-button>
			<el-alert title="v-auth指令 是$AUTH的语法糖, 原先需要使用v-if来判断是否有权限, 使用指令将减少代码冗余. 并且支持传入数组,有一项满足就判断有权限" style="margin-top: 20px;"></el-alert>
		</el-card>
		<el-card shadow="never" header="v-role 角色权限控制" style="margin-top: 15px;">
			<el-button v-role="'admin'" type="primary">v-role="'admin'"</el-button>
			<el-button v-role="['SA','admin']" type="primary">v-role="['SA','admin']"</el-button>
			<el-alert title="v-role指令 是$ROLE的语法糖, 原理是判断是否含有用户所在的角色别名" style="margin-top: 20px;"></el-alert>
		</el-card>
		<el-card shadow="never" header="v-time 时间转换" style="margin-top: 15px;">
			<p>
				<el-tag v-time="1630117968295" format="yyyy-MM-dd hh:mm:ss"></el-tag>
			</p>
			<p style="margin-top: 15px;">
				<el-tag v-time.tip="time1"></el-tag>
			</p>
			<p style="margin-top: 15px;">
				<el-tag v-time.tip="time2"></el-tag>
			</p>
			<p style="margin-top: 15px;">
				<el-tag v-time.tip="time3"></el-tag>
			</p>
			<el-alert title="指令方式日期时间转换,如设置'tip'修饰符将会转换成相对时间,并且每60秒自动更新" style="margin-top: 20px;"></el-alert>
		</el-card>
		<el-card shadow="never" header="v-copy 一键复制" style="margin-top: 15px;">
			<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="copyText"></el-input>
			<el-button v-copy="copyText" type="primary" style="margin-top: 15px;">复制</el-button>
			<el-alert title="点击复制按钮会将文本框绑定的值复制到剪切板, 试着粘贴到其他地方看看效果" style="margin-top: 20px;"></el-alert>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'directive',
		data() {
			return {
				time1: new Date(),
				time2: new Date().setMinutes(new Date().getMinutes()-1),
				time3: new Date().setMinutes(new Date().getMinutes()-120),
				copyText: '测试复制内容'
			}
		},
		created() {

		}
	}
</script>

<style>
</style>
