<template>
	<view class="subject">
		<view class="title">{{data.name}}</view>
		<view class="text-lg text-gray margin-top margin-bottom">最近更新时间：{{data.updated_at}}</view>
		<u-parse v-if="data.column_property && list === '1'" class="details" :content="data.column_property.details"/>
		<u-parse v-if="data.article_property && list === '0'" class="details" :content="data.article_property.details"/>
		<view class="text-lg text-gray margin-top">阅读 {{data.pv}}</view>
	</view>
</template>

<script>
	import Article from '../../api/article'
	import Column from '../../api/column'
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				data: {},
				id: 0,
				list: 0
			}
		},
		onLoad: function(options) {
			if(options.id && options.list){
				this.id = options.id
				this.list = options.list
				this.loadData()
				this.setPv()
			}
		},
		methods: {
			//获取列表
			loadData(type){
				const that = this
				if(this.list === '1'){	//栏目详情
					Column.getDetails(that.id,{},function(res){
						that.data = res
					})
				}else{
					Article.getDetails(that.id,{},function(res){
						that.data = res
					})
				}
			},
			// 增加访问量
			setPv(){
				const that = this
				if(this.list === '1'){	//栏目
					Column.setPv(that.id,{},function(res){})
				}else{
					Article.setPv(that.id,{},function(res){})
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #FFFFFF;
		padding-bottom: 30upx;
	}
	.subject{
		padding: 40rpx;
	}
	.subject .title{
		font-size: 52upx;
		text-align: left;
		line-height: 1.4;
		font-weight: 400;
	}
	.subject .details{
		line-height: 60upx;
		letter-spacing: 2px;
		width: 100%;
	}
</style>
