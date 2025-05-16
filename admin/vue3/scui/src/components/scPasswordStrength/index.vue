<!--
 * @Descripttion: 密码强度检测
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2022年6月2日15:36:01
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<div class="sc-password-strength">
		<div class="sc-password-strength-bar" :class="`sc-password-strength-level-${level}`"></div>
	</div>
</template>

<script>
	export default {
		props: {
			modelValue: { type: String, default: "" },
		},
		data() {
			return {
				level: 0
			}
		},
		watch: {
			modelValue() {
				this.strength(this.modelValue)
			}
		},
		mounted() {
			this.strength(this.modelValue)
		},
		methods: {
			strength(v){
				var _level = 0
				//长度
				var has_length = v.length >= 6
				//包含数字
				var has_number = /\d/.test(v)
				//包含小写英文
				var has_lovercase = /[a-z]/.test(v)
				//包含大写英文
				var has_uppercase = /[A-Z]/.test(v)
				//没有连续的字符3位
				var no_continuity = !/(\w)\1{2}/.test(v)
				//包含特殊字符
				var has_special = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/.test(v)

				if(v.length <= 0){
					_level = 0
					this.level = _level
					return false
				}
				if(!has_length){
					_level = 1
					this.level = _level
					return false
				}
				if(has_number){
					_level += 1
				}
				if(has_lovercase){
					_level += 1
				}
				if(has_uppercase){
					_level += 1
				}
				if(no_continuity){
					_level += 1
				}
				if(has_special){
					_level += 1
				}
				this.level = _level
			}
		}
	}
</script>

<style scoped>
	.sc-password-strength {height: 5px;width: 100%;background: var(--el-color-info-light-5);border-radius: 5px;position: relative;margin:10px 0;}
	.sc-password-strength:before {left: 20%;}
	.sc-password-strength:after {right: 20%;}
	.sc-password-strength:before, .sc-password-strength:after {position: absolute;content: "";display: block;width: 20%;height: inherit;border: 5px solid var(--el-bg-color-overlay);border-top: 0;border-bottom: 0;z-index: 1;background-color: transparent;box-sizing: border-box;}
	.sc-password-strength-bar {position: absolute;height: inherit;width: 0%;border-radius: inherit;transition: width .5s ease-in-out,background .25s;background: transparent;}
	.sc-password-strength-level-1 {width: 20%;background-color: var(--el-color-error);}
	.sc-password-strength-level-2 {width: 40%;background-color: var(--el-color-error);}
	.sc-password-strength-level-3 {width: 60%;background-color: var(--el-color-warning);}
	.sc-password-strength-level-4 {width: 80%;background-color: var(--el-color-success);}
	.sc-password-strength-level-5 {width: 100%;background-color: var(--el-color-success);}
</style>
