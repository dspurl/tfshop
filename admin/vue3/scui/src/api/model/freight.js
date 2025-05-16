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
	list: {
		url: `${process.env.VUE_APP_API_URL}/freight`,
		name: "运费模板列表",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	},
	create: {
		url: `${process.env.VUE_APP_API_URL}/freight`,
		name: "创建运费模板",
		post: async function(data={}){
			return await http.post(this.url, data);
		}
	},
	edit: {
		url: `${process.env.VUE_APP_API_URL}/freight`,
		name: "保存运费模板",
		post: async function(data={}){
			return await http.post(this.url + '/' + data.id, data);
		}
	},
	destroy: {
		url: `${process.env.VUE_APP_API_URL}/freight/destroy`,
		name: "删除运费模板",
		post: async function(id,data){
			return await http.post(this.url + '/' + id, data);
		}
	},
}
