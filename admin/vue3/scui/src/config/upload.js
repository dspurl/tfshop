import API from "@/api";

//上传配置

export default {
	apiObj: API.common.upload,			//上传请求API对象
	successCode: 200,					//请求完成代码
	maxSize: 10,						//最大文件大小 默认10MB
	parseData: function (res) {
		return {
			code: res.code,				//分析状态字段结构
			src: res.data.src,			//分析图片远程地址结构
			msg: res.message			//分析描述字段结构
		}
	}
}
