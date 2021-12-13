import scFileSelect from "@/components/scFileSelect";
import infoDialog from "../info";
export default {
	name: "Resource",
	components: {
		scFileSelect,
		infoDialog,
	},
	data() {
		return {
			file: "",
			multiple: true,
			hideUpload: false,
			info: false,
			upload: "",
			upload2: "",
		};
	},
	mounted() {},
	methods: {
		view(item) {
			if (item) {
                this.info = true
				this.$nextTick(() => {
					this.$refs.infoDialog.setData(item);
				});
			}
		},
	},
};
