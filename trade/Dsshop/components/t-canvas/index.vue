<!-- 
使用方法 
 <sku :getList="getList" @toggleSpec="toggleSpec"></sku>
 getList：商品数据
 update: 是否是更新

 cartDetails: 购物车时的单条数据
 @toggleSpec:弹出框操作
 @purchasePattern: 购买类型展示
 @loadCart:完成时触发
 
 order: 是否是订单
 @setOrder:修改后传给父节点的值，用来父节点商品更新
 -->
<template>
	<view>
		<canvas class='canvas' canvas-id='canvas' :style="{ 'width': width + unit,'height': height + unit}"></canvas>
		<view @click="getTempFilePath">生成图片</view>
	</view>
</template>

<script>
var canvasw = 0;
	var canvash = 0;
	uni.getSystemInfo({
		success: function(res) {
			canvasw = res.windowWidth;
			canvash = res.windowHeight;
		},
	})
export default{
	name: 'TCanvas',
	props: {
		width: {
			type: Number,
			default: 210 //210
		},
		height: {
			type: Number,
			default: 297 //297
		},
		unit: {
			type: String,
			default: 'px' //mm
		},
		print: {
			type: Boolean,
			default: false
		},
		canvasData: {
			type: Array,
			default: function(){
				return [];
			}
		}
	},
	data() {
		return {
			ctx: null,
			y: 0,
			itemY: 0,
			line: 1
		};
	},
	watch: {
		canvasData(newVal) {
			this.canvasData = newVal
			this.createCanvas()
		}
	},
	created() {
		this.createCanvas()
	},
	methods:{
		createCanvas(){
			const canvasData = this.canvasData
			this.ctx = uni.createCanvasContext('canvas')
			/* 绘制背景*/
			this.ctx.rect(0, 0, this.width, this.height)
			this.ctx.setFillStyle('white')
			this.ctx.fillRect(0, 0, this.width, this.height)
			if(canvasData.length > 0){
				canvasData.forEach((item,index)=>{
					this.itemY = 0
					const height = item.height ? item.height : 20
					const itemY = item.y ? item.y : 0
					if(index === 0){
						this.y = this.y + itemY
						this.itemY = itemY
					}else{
						this.y = this.y + itemY +height
						this.itemY = itemY +height
					}
					item.y = this.y
					if(item.block){
						this.drawBlock(item)
					}else{
						this.drawContent(item)
					}
				})
			}
			this.ctx.draw(true)
		},
		//获取临时路径
		getTempFilePath() {
		    uni.canvasToTempFilePath({
		      canvasId: 'canvas',
		      success: (res) => {
		        console.log(res)
		      }
		    })
		},
		
		// 渲染区块
		drawBlock(data){
			if(data){
				const x = data.x ? data.x : 0
				const y = data.y ? data.y : 0
				const block = data.block
				const width = (this.width-x)/block	//每块的宽度
				data.son.forEach((item,index)=>{
					item.x = item.x ? item.x + width*index+x : width*index+x
					item.y = item.y ? item.y + y : y
					this.drawContent(item)
				})
			}
			
		},
		// 渲染内容
		drawContent(item){
			switch(item.type){
				case 'text':
				this.drawTextData(item)
				break
				case 'table':
				this.drawTable(item)
				break
				case 'box':
				this.drawBox(item)
				this.y-= this.itemY
				break
			}
		},
		/**
		 * 渲染文本
		 *
		 * @param {Object} obj
		 */
		drawTextData(obj){
			let text = {
				  x: obj.x ? obj.x : 0,
				  y: obj.y ? obj.y : 0,
				  color: obj.fillStyle ? obj.fillStyle : '#000',
				  size: obj.fontSize ? obj.fontSize : 12,
				  align: obj.textAlign ? obj.textAlign : 'left',
				  height: obj.height ? obj.height : 20,
				  line: obj.line ? obj.line : 1,
				  width: obj.width ? obj.width : this.width,
				  baseline: obj.textBaseline ? obj.textBaseline: 'top',
				  text: obj.text,
				  bold: obj.bold ? obj.bold : false,
				  paddingLeftRight: obj.paddingLeftRight ? obj.paddingLeftRight : 0,
				  padding: obj.padding ? obj.padding : 0
				}
			if(obj.align === 'center'){
				text.x = (text.width - text.x)/2
				text.align = 'center'
			} else if(obj.align === 'right'){
				text.x = (text.width - text.x)
				text.align = 'right'
			}
			this.textWrap(text)
		},
		/**
		 * 渲染表格
		 *
		 * @param {Object} obj
		 */
		drawTable(obj){
			const x = obj.x ? obj.x : 0
			const y = obj.y ? obj.y : 0
			let padding = obj.padding ? obj.padding : 0
			if(obj.son){
				obj.son.forEach((item,index)=>{
					padding = item.padding = item.padding ? item.padding : padding
					const itemHeight = item.height ? item.height : 20
					//根据表格内容算出当前行的高度
					if(item.son){
						this.line=this.getTextLineList(item.son,x)
					}
					if(index>0){
						this.y+= (itemHeight + padding*2)
					}
					let width =(this.width-x*2)/item.son.length
					
					if(item.type === 'th' && item.son){
						let item2x = x
						item.son.forEach((item2,index2)=>{
							padding = item2.padding = item2.padding ? item2.padding : padding
							if(item.subshare){
								width = (this.width-x*2)/item.subshare * item2.share
							}
							item2.x = item2x
							item2x+=width
							item2.y = item2.y ? item2.y : 0
							item2.y = y
							item2.width = width
							item2.padding = padding
							item2.paddingTop = item2.paddingTop ? item2.paddingTop : item.paddingTop
							item2.paddingLeftRight = item2.paddingLeftRight ? item2.paddingLeftRight : item.paddingLeftRight
							this.drawBox(item2)
						})
					}else{
						let item2x = x
						item.son.forEach((item2,index2)=>{
							padding = item2.padding = item2.padding ? item2.padding : padding
							if(item.subshare){
								width = (this.width-x*2)/item.subshare * item2.share
							}
							item2.x = item2x
							item2x+=width
							item2.y = item2.y ? item2.y : 0
							item2.y = y
							item2.width = width
							item2.padding = padding
							item2.paddingTop = item2.paddingTop ? item2.paddingTop : item.paddingTop
							item2.paddingLeftRight = item2.paddingLeftRight ? item2.paddingLeftRight : item.paddingLeftRight
							this.drawBox(item2)
						})
					}
					
					if(this.line>1){
						this.y+=(this.line)*itemHeight
						this.y-= this.itemY
					}
					
				})
				
			}
		},
		/**
		 * 获取当前行最大高度
		 * @param {Object} obj
		 * @return {Array} arrTr
		 */ 
		 getTextLineList(obj,x){
			 let line = 1
			 let line2 = 1
			 let height = 20
			 let padding = obj.padding ? obj.padding : 0
			 obj.forEach(item=>{
				const width =(this.width-x*2)/obj.length
				item.width = width
				line2 = this.getTextLine(item).length
				if(line2>item.line){
					line2 = item.line
				}
				if(line2>line){
					line = line2
				}
			 })
			 
			return line
		 },
		/**
		 * 渲染带边框的内容
		 *
		 * @param {Object} obj
		 */
		drawBox(obj){
			const strokeStyle = obj.strokeStyle ? obj.strokeStyle : '#000'
			const x = obj.x ? obj.x : 0
			let y = obj.y ? obj.y : 0
			const height = 0
			const align = obj.align ? obj.align : ''
			const width = obj.width ? obj.width : this.width-2*x
			const padding = obj.padding ? obj.padding : 0
			if(obj.son){	//多行
				this.y+= obj.son.length*20 + padding*2
				this.ctx.setStrokeStyle(strokeStyle)
				this.ctx.strokeRect(x, y, width, obj.son.length*20 + padding*2)
				obj.son.forEach((item,index)=>{
					const itemHeight = item.height ? item.height : 20
					if(padding){	//内边距
						y = y + itemHeight * index
						if(index === 0){
							y = y + padding
						}
						item.x = x + obj.padding
						item.y = y
					}else{
						y = y + itemHeight * index
						item.y = y
						item.x = x
					}
					item.align = item.align ? item.align : align
					this.drawTextData(item)
				})
			}else{	//表格
				let lineHeight=(20 + padding*2)*this.line
				// this.y+=padding
				this.ctx.setStrokeStyle(strokeStyle)
				this.ctx.strokeRect(x, this.y, width, lineHeight)
				const itemHeight = obj.height ? obj.height : 20
				if(obj.paddingLeftRight){
					obj.x = x + obj.paddingLeftRight
				}else{
					obj.x = x
				}
				if(obj.paddingTop){
					obj.y = this.y + obj.paddingTop
				}else{
					obj.y = this.y + padding
				}
				if(obj.align === 'center'){
					obj.x = obj.x + width/2
					obj.textAlign = 'center'
				} else if(obj.align === 'right'){
					obj.x = obj.x + width
					obj.textAlign = 'right'
				}
				obj.align = ''
				this.drawTextData(obj)
			}
		},
		/**
		 * 渲染文字
		 *
		 * @param {Object} obj
		 */
		  drawText(obj) {
		    this.ctx.save();
		    this.ctx.setFillStyle(obj.color);
		    this.ctx.setFontSize(obj.size);
		    this.ctx.setTextAlign(obj.align);
		    this.ctx.setTextBaseline(obj.baseline);
		    if (obj.bold) {
		      this.ctx.fillText(obj.text, obj.x, obj.y - 0.1);
		      this.ctx.fillText(obj.text, obj.x - 0.1, obj.y);
		    }
		    this.ctx.fillText(obj.text, obj.x, obj.y);
		    if (obj.bold) {
		      this.ctx.fillText(obj.text, obj.x, obj.y + 0.1);
		      this.ctx.fillText(obj.text, obj.x + 0.1, obj.y);
		    }
		    this.ctx.restore();
		  },
		/**
		 * 获取文本折行
		 * @param {Object} obj
		 * @return {Array} arrTr
		 */
		  getTextLine(obj) {
		    this.ctx.setFontSize(obj.size);
		    let arrText = obj.text.split('');
		    let line = '';
		    let arrTr = [];	
		    for (let i = 0; i < arrText.length; i++) {
		      var testLine = line + arrText[i];
		      var metrics = this.ctx.measureText(testLine);
		      var width = metrics.width
			  
			  
			  // let objWidth = obj.width-obj.paddingLeftRight*2
			  let objWidth = obj.width
			  if(obj.align === 'left' || obj.align === 'right'){
				objWidth = objWidth - obj.paddingLeftRight*2
			  }
		      if (width > objWidth && i > 0) {
		        arrTr.push(line);
		        line = arrText[i];
		      } else {
		        line = testLine;
		      }
			  
		      if (i == arrText.length - 1) {
		        arrTr.push(line);
		      }
		    }
		    return arrTr;
		  },
		/**
		 * 文本换行
		 *
		 * @param {Object} obj
		 */
		  textWrap(obj) {
		    let tr = this.getTextLine(obj);
		    for (let i = 0; i < tr.length; i++) {
		      if (i < obj.line) {
		        let txt = {
		          x: obj.x,
		          y: obj.y + (i * obj.height),
		          color: obj.color,
		          size: obj.size,
		          align: obj.align,
		          baseline: obj.baseline,
		          text: tr[i],
		          bold: obj.bold
		        }
				
		        if (tr.length > obj.line){
		          if (i == obj.line - 1) {
		            txt.text = txt.text.substring(0, txt.text.length - 3) + '......';
		          }
		        }
		        
		        this.drawText(txt);
		      }
		    }
		  }
	},

}
</script>

<style lang="scss">
.canvas-poster {
  position: fixed;
  top: 100%;
  left: 100%;
}
</style>
