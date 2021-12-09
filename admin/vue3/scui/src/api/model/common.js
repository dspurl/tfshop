import http from "@/utils/request"

export default {
	upload: {
		url: `${process.env.VUE_APP_API_URL}/resourceUpload`,
		name: "文件上传",
		post: async function(data, config={}){
			return await http.post(this.url, data, config);
		}
	}
}
