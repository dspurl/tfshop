/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import http from "@/utils/request"
export default {
	detail: {
		url: `${process.env.VUE_APP_API_URL}/project`,
		name: "项目详情",
		get: async function (id = "") {
			return await http.get(this.url + "/" + id);
		},
	},
	qr: {
		url: `${process.env.VUE_APP_API_URL}/projectQr`,
		name: "获取项目小程序二维码",
		get: async function(data={}){
			return await http.get(this.url, data,{
				responseType: 'blob'
			});
		}
	},
}
