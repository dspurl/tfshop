<template>
	<view class="t-tr">
		<view v-if="isCheck" class="t-check-box" :style="{ 'border-width': thBorder + 'px' ,'border-color':borderColor}">
			<checkbox-group @change="checkboxChange">
				<checkbox :value="checkboxData.value + ''" :checked="checkboxData.checked" />
			</checkbox-group>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			fontSize: String,
			color: String,
			align: String
		},
		inject: ['table'],
		provide() {
			return {
				tr: this
			};
		},
		data() {
			return {
				isCheck: false,
				checkboxData: {
					value: 0,
					checked: false
				},
				checked: false,
				thBorder: '1',
				borderColor: '#000000'
			};
		},
		created() {
			this.thBorder = this.table.border;
			this.borderColor = this.table.borderColor;
			this.table.childrens.push(this);
			this.checkboxData.value = this.table.index++;
			this.isCheck = this.table.isCheck;

		},
		methods: {
			checkboxChange(e) {
				this.checkboxData.checked = !this.checkboxData.checked;
				this.table.childrens[this.checkboxData.value] = this;
				this.table.fire(e.detail.value[0] ? true : false, this.checkboxData.value, this.table.index);
			}
		}
	};
</script>

<style>
	.t-tr {
		width: 100%;
		display: flex;
	}

	.t-tr t-th,
	.t-tr t-td {
		display: flex;
		flex: 1;
	}

	.t-tr .t-check-box {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80upx;
		color: #3b4246;
		border-left: 1px #d0dee5 solid;
		border-top: 1px #d0dee5 solid;
	}

	.t-tr .t-check-box checkbox {
		transform: scale(0.8);
	}
</style>
