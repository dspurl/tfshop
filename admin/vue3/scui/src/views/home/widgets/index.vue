<template>
	<div :class="['widgets-home', customizing?'customizing':'']" ref="main">
		<div class="widgets-content">
			<div class="widgets-top">
				<div class="widgets-top-title">
					控制台
				</div>
				<div class="widgets-top-actions">
					<el-button v-if="customizing" type="primary" icon="el-icon-check" round @click="save">完成</el-button>
					<el-button v-else type="primary" icon="el-icon-edit" round @click="custom">自定义</el-button>
				</div>
			</div>
			<div class="widgets" ref="widgets">
				<div class="widgets-wrapper">
					<div v-if="nowCompsList.length<=0" class="no-widgets">
						<el-empty image="img/no-widgets.svg" description="没有部件啦" :image-size="280"></el-empty>
					</div>
					<el-row :gutter="15">
						<el-col v-for="(item, index) in grid.layout" v-bind:key="index" :md="item" :xs="24">
							<draggable v-model="grid.copmsList[index]" animation="200" handle=".customize-overlay" group="people" item-key="com" dragClass="aaaaa" force-fallback fallbackOnBody class="draggable-box">
								<template #item="{ element }">
									<div class="widgets-item">
										<component :is="allComps[element]"></component>
										<div v-if="customizing" class="customize-overlay">
											<el-button class="close" type="danger" plain icon="el-icon-close" size="small" @click="remove(element)"></el-button>
											<label><el-icon><component :is="allComps[element].icon" /></el-icon>{{ allComps[element].title }}</label>
										</div>
									</div>
								</template>
							</draggable>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div v-if="customizing" class="widgets-aside">
			<el-container>
				<el-header>
					<div class="widgets-aside-title"><el-icon><el-icon-circle-plus-filled/></el-icon>添加部件</div>
					<div class="widgets-aside-close" @click="close()"><el-icon><el-icon-close /></el-icon></div>
				</el-header>
				<el-header style="height:auto">
					<div class="selectLayout">
						<div class="selectLayout-item item01" :class="{active:grid.layout.join(',')=='12,6,6'}" @click="setLayout([12,6,6])">
							<el-row :gutter="2">
								<el-col :span="12"><span></span></el-col>
								<el-col :span="6"><span></span></el-col>
								<el-col :span="6"><span></span></el-col>
							</el-row>
						</div>
						<div class="selectLayout-item item02" :class="{active:grid.layout.join(',')=='24,16,8'}" @click="setLayout([24,16,8])">
							<el-row :gutter="2">
								<el-col :span="24"><span></span></el-col>
								<el-col :span="16"><span></span></el-col>
								<el-col :span="8"><span></span></el-col>
							</el-row>
						</div>
						<div class="selectLayout-item item03" :class="{active:grid.layout.join(',')=='24'}" @click="setLayout([24])">
							<el-row :gutter="2">
								<el-col :span="24"><span></span></el-col>
								<el-col :span="24"><span></span></el-col>
								<el-col :span="24"><span></span></el-col>
							</el-row>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<div class="widgets-list">
						<div v-if="myCompsList.length<=0" class="widgets-list-nodata">
							<el-empty description="没有部件啦" :image-size="60"></el-empty>
						</div>
						<div v-for="item in myCompsList" :key="item.title" class="widgets-list-item">
							<div class="item-logo"><el-icon><component :is="item.icon" /></el-icon></div>
							<div class="item-info">
								<h2>{{ item.title }}</h2>
								<p>{{ item.description }}</p>
							</div>
							<div class="item-actions">
								<el-button type="primary" icon="el-icon-plus" size="small" @click="push(item)"></el-button>
							</div>
						</div>
					</div>
				</el-main>
				<el-footer style="height:51px;">
					<el-button size="mini" @click="backDefaul()">恢复默认</el-button>
				</el-footer>
			</el-container>
		</div>
	</div>
</template>
<style lang='scss' scoped>
  @import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>