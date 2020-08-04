<template>
	<view class="t-td" :style="{ 'border-width': thBorder + 'px','border-color':borderColor ,'font-size':fontSize+'px' ,'color':color,'justify-content':tdAlignCpd}">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			align: String
		},
		data() {
			return {
				thBorder: '1',
				borderColor: '#000000',
				fontSize: '14',
				color: '#555c60',
				tdAlign: 'center'
			};
		},
		inject: ['table', 'tr'],

		created() {
			this.thBorder = this.table.border;
			this.borderColor = this.table.borderColor;
			this.fontSize = this.tr.fontSize;
			this.color = this.tr.color;
			if (this.align) {
				this.tdAlign = this.align;
			} else {
				this.tdAlign = this.tr.align
			}
		},
		computed: {
			tdAlignCpd() {
				let nameAlign = '';
				switch (this.tdAlign) {
					case 'left':
						nameAlign = 'flex-start'
						break;
					case 'center':
						nameAlign = 'center'
						break;
					case 'right':
						nameAlign = 'flex-end'
						break;
					default:
						nameAlign = 'center'
						break;
				}
				return nameAlign
			}
		}
	};
</script>

<style>
	.t-td {
		flex: 1;
		display: flex;
		align-items: center;
		width: 100%;
		border-top: 1px #d0dee5 solid;
		border-left: 1px #d0dee5 solid;
		text-align: left;
		color: #555c60;
		font-size: 14px;

	}
</style>
