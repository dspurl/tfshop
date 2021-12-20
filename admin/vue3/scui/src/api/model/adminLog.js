import http from "@/utils/request"
export default {
	list: {
		url: `${process.env.VUE_APP_API_URL}/adminLog`,
		name: "管理员日志列表",
		get: async function(data={}){
			return await http.get(this.url, data);
		}
	}
}
