import dsVideo from "@/components/dsVideo";
export default {
	name: "ResourceInfo",
	components: {
		dsVideo
	},
	data() {
		return {
			data: {
				info: {},
				resource: {
					url: ''
				}
			},
			loading: true
		};
	},
	mounted() { },
	methods: {
		//表单注入数据
		setData(data) {
			this.loading = true
			if (!data.resource) {
				data.resource = { url: '' }
			}
			Object.assign(this.data, data);
			this.loading = false
		},
		//封面上传成功
		cover(e) {
			this.$API.resource.cover.post(this.data.id, { resource_id: e.id });
			this.$message.success(
				this.$t("general.operateSuccessfully")
			);
		},
		//封面删除
		coverDel(){
			this.$API.resource.cover.post(this.data.id, { resource_id: 0 });
		},
		_isImg(fileUrl) {
			const ext = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isPdf(fileUrl) {
			const ext = ['.pdf']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isVideo(fileUrl) {
			const ext = ['.mp4', '.rmvb', '.mkv', '.avi']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isWord(fileUrl) {
			const ext = ['.doc', '.docx']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isExcl(fileUrl) {
			const ext = ['.xls', '.xlsx']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isTxt(fileUrl) {
			const ext = ['.txt']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		}
	},
};
