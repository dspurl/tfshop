<template>
	<view class="content">
		<view class="score-list" v-for="(ite,ind) in commodity" :key="ind">
			<view class="goods-box-single margin-top">
				<image class="goods-img" :src="ite.img" mode="aspectFill" lazy-load></image>
				<view class="right">
					<text class="title clamp">{{ite.name}}</text>
					<text class="attr-box clamp">{{ite.specification}}</text>
					<text><text class="text-red text-price padding-right">{{ite.price}}</text><text>x {{ite.number}}</text></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">综合评分</view>
				<uni-rate @change="setScore" v-model="data[ind].score" active-color="#fa436a" :is-fill="false"/>
				<text>{{scoreName[data[ind].score]}}</text>
			</view>
			<view class="cu-bar bg-white">
				<view class="action">
					添加图片
				</view>
				<view class="action">
					{{data[ind].resources.length}}/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in data[ind].resources" :key="index" @tap="ViewImage(ind,index)" :data-url="data[ind].resources[index]">
					 <image :src="data[ind].resources[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg(ind,index)">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage(ind)" v-if="data[ind].resources.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<checkbox-group @change="setAnonymity(ind)">
					<checkbox class='round red' :class="data[ind].anonymity?'checked':''" :checked="data[ind].anonymity?true:false"></checkbox>
					<text class="anonymity">匿名评价</text>
				</checkbox-group>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" :disabled="data[ind].details!=null" @input="textareaAInput($event,ind)" placeholder="亲,您对这个商品满意吗？您的评价会帮助我们提供更好的服务哦~"></textarea>
			</view>
		</view>
		<view class="height45"></view>
		<button class="add-btn" @click="addComment()">提交评价</button>
	</view>
</template> 
<style lang='scss' scoped>
@import "./scss/score";
</style>
<script>
import js from './js/score'
export default js
</script>

