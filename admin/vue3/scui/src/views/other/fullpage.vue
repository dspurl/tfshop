<template>
	<el-container>
		<el-header>
			<el-page-header content="FullPage" @back="goBack" />
		</el-header>
		<el-main>
			<el-empty description="FullPageMain"></el-empty>
		</el-main>
	</el-container>
</template>

<script>
	export default {
		name: 'fullpage',
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {
			goBack(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style>
</style>
