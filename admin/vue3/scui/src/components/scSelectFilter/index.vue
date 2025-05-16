<!--
 * @Descripttion: 分类筛选器
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2022年5月26日15:59:52
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<div class="sc-select-filter">
		<div v-if="data.length<=0" class="sc-select-filter__no-data">
			暂无数据
		</div>
		<div v-for="item in data" :key="item.key" class="sc-select-filter__item">
			<div class="sc-select-filter__item-title" :style="{'width':labelWidth+'px'}"><label>{{item.title}}：</label></div>
			<div class="sc-select-filter__item-options">
				<ul>
					<li :class="{'active':selected[item.key]&&selected[item.key].includes(option.value)}" v-for="option in item.options" :key="option.value" @click="select(option, item)">
						<el-icon v-if="option.icon"><component :is="option.icon" /></el-icon>
						<span>{{option.label}}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			data: { type: Array, default: () => [] },
			selectedValues: { type: Object, default: () => { return {} } },
			labelWidth: {type: Number, default: 80},
			outputValueTypeToArray: { type: Boolean, default: false }
		},
		data() {
			return {
				selected: {}
			}
		},
		watch:{
			data(val) {
				val.forEach(item => {
					this.selected[item.key] = this.selectedValues[item.key] ||
                      (Array.isArray(item.options) && item.options.length) ? [item.options[0].value] : []
				})
			}
		},
		computed: {
			selectedString() {
				var outputData = JSON.parse(JSON.stringify(this.selected))
				for (var key in outputData) {
					outputData[key] = outputData[key].join(",")
				}
				return outputData
			}
		},
		mounted() {
			//默认赋值
			this.data.forEach(item => {
				this.selected[item.key] = this.selectedValues[item.key] ?
					this.selectedValues[item.key] : (Array.isArray(item.options) && item.options.length) ? [item.options[0].value] : []
			})
		},
		methods: {
			select(option, item){
				//判断单选多选
				if(item.multiple){
					//如果多选选择的第一个
					if(option.value === item.options[0].value){
						//就赋值第一个的值
						this.selected[item.key] = [option.value]
					}else{
						//如果选择的值已有
						if(this.selected[item.key].includes(option.value)){
							//删除选择的值
							this.selected[item.key].splice(this.selected[item.key].findIndex(s => s === option.value), 1)
							//当全删光时，把第一个选中
							if(this.selected[item.key].length == 0){
								this.selected[item.key] = [item.options[0].value]
							}
						}else{
							//未有值的时候，追加选中值
							this.selected[item.key].push(option.value)
							//当含有第一个的值的时候，把第一个删除
							if(this.selected[item.key].includes(item.options[0].value)){
								this.selected[item.key].splice(this.selected[item.key].findIndex(s => s === item.options[0].value), 1)
							}
						}
					}
				}else{
					//单选时，如果点击了已有值就赋值
					if(!this.selected[item.key].includes(option.value)){
						this.selected[item.key] = [option.value]
					}else{
						return false
					}
				}
				this.change()
			},
			change(){
				if(this.outputValueTypeToArray){
					this.$emit('onChange', this.selected)
				}else{
					this.$emit('onChange', this.selectedString)
				}
			}
		}
	}
</script>

<style scoped>
	.sc-select-filter {width: 100%;}
	.sc-select-filter__item {display: flex;}
	.sc-select-filter__item-title {width: 80px;}
	.sc-select-filter__item-title label {font-size: 14px;padding-top:13px;display: inline-block;color: #999;}
	.sc-select-filter__item-options {flex: 1;border-bottom: 1px dashed var(--el-border-color-light);}
	.sc-select-filter__item-options ul {display: flex;flex-wrap: wrap;padding-top: 10px;}
	.sc-select-filter__item-options li {list-style: none;cursor: pointer;height:28px;padding:0 15px;border-radius:32px;margin: 0 10px 10px 0;display: flex;align-items: center;background: var(--el-color-primary-light-9);}
	.sc-select-filter__item-options li .el-icon {margin-right: 3px;font-size: 16px;}
	.sc-select-filter__item-options li:hover {color: var(--el-color-primary);}
	.sc-select-filter__item-options li.active {background: var(--el-color-primary);color: #fff;font-weight: bold;}
	.sc-select-filter__item:last-of-type .sc-select-filter__item-options {border: 0;}

	.sc-select-filter__no-data {color: #999;}
</style>
