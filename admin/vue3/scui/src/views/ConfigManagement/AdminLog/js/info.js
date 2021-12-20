export default {
	data() {
		return {
			data: {},
			activeNames: [],
			copyable: {
				copyText: this.$t("general.copy"),
				copiedText: this.$t("general.copying"),
			},
		};
	},
	methods: {
		setData(data) {
			this.data = data;
		},
	},
};
