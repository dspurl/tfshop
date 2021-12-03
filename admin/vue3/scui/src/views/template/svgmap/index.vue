<!--
 * @Descripttion: SVG MAP
 * @version: 2.0
 * @Author: sakuya
 * @Date: 2021年6月16日15:05:15
 * @LastEditors: sakuya
 * @LastEditTime: 2021年8月23日13:42:58
-->

<template>
	<el-container>

		<el-main class="nopadding" style="background: #f6f8f9;" v-loading="mapLoading">
			<scEcharts ref="map" :option="option"></scEcharts>
		</el-main>
		<el-aside width="340px" style="border-left: 1px solid #e6e6e6;border-right: 0;padding:15px;">
			<el-descriptions title="Shanghai China" :column="1" border>
				<el-descriptions-item label="region">Shanghai</el-descriptions-item>
				<el-descriptions-item label="area">6340.5 km2</el-descriptions-item>
				<el-descriptions-item label="state"><em class="state state-1 status-processing"></em></el-descriptions-item>
			</el-descriptions>
			<el-collapse style="margin-top: 15px;">
				<el-collapse-item title="video monitor" name="1">
					<div class="screen" style="background: #000;height:180px;color: #999;text-align: center;">
						<el-icon style="font-size: 40px;margin-top: 50px;"><el-icon-video-play /></el-icon>
						<p>camera</p>
					</div>
				</el-collapse-item>
			</el-collapse>
			<el-alert title="地图数据来自阿里项目 DATAV.GeoAtlas" type="info" style="margin-top: 15px;"></el-alert>
		</el-aside>
	</el-container>
</template>

<script>
	import scEcharts from '@/components/scEcharts';

	export default {
		name: 'svgmap',
		components: {
			scEcharts
		},
		data() {
			return {
				mapLoading: false,
				option: {}
			}
		},
		mounted() {
			this.getSvg()
		},
		methods: {
			async getSvg(){
				this.mapLoading = true;
				var map = await this.$HTTP.get('img/shanghai.json')
				this.mapLoading = false;
				scEcharts.registerMap('shanghai', map);

				this.option = {
					title: {
						text: 'Map Demo',
						subtext: '可用于展示GeoJson/SVG的地图或者其它图形',
						left: '20',
						top: '20'
					},
					tooltip: {
					},
					geo: {
						map: 'shanghai',
						zoom: 1,
						roam: true,
						selectedMode: 'single',
						itemStyle: {
							areaColor: 'rgba(128, 128, 128, 0.1)',
							borderColor: 'rgba(0, 0, 0, 0.2)',
							borderWidth: 1
						},
						select: {
							itemStyle: {
								color: 'rgba(0, 153, 255, 0.8)'
							},
							label: {
								show: false,
							}
						},
						emphasis: {
							itemStyle: {
								color: null
							},
							label: {
								show: false
							}
						}
					},
					series: {
						name: '告警',
						type: 'effectScatter',
						symbolSize: 20,
						coordinateSystem: 'geo',
						geoIndex: 0,
						encode: {
							tooltip: 2
						},
						data: [
							[121.3154759073276, 30.819428360452587]
						]
					}
				}

				var myChart = this.$refs.map.myChart
				myChart.on('geoselectchanged', function (params) {
					var selectedNames = params.allSelected[0].name;
					console.log('selected', selectedNames);
				});
				myChart.getZr().on('click', function (params) {
					var pixelPoint = [params.offsetX, params.offsetY];
					    var dataPoint = myChart.convertFromPixel({ geoIndex: 0 }, pixelPoint);
					    // 在 SVG 上点击时，坐标会被打印。
					    // 这些坐标可以在 `series.data` 里使用。
					    console.log(dataPoint);

				});
			},
		}
	}
</script>

<style scoped>
	.state {width:8px;height:8px;background: #ddd;display: inline-block;border-radius: 50%;vertical-align: middle;}
	.state-1 {background: #409EFF;}
	.state-2 {background: #F56C6C;}
	.status-processing {position: relative;}
	.status-processing:after {position: absolute;top:0px;left:0px;width: 100%;height: 100%;border-radius: 50%;background: inherit;content: '';animation: warn 1.2s ease-in-out infinite;}

	@keyframes warn {
		0% {
			transform: scale(0.5);
			opacity: 1;
		}
		30% {
			opacity: 1;
		}
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
