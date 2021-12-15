import axios from "axios";
import { ElNotification, ElMessageBox } from "element-plus";
import { getToken, removeToken } from "@/utils/auth";
import router from "@/router";
import tool from "@/utils/tool";

axios.defaults.baseURL = "";

axios.defaults.timeout = process.env.VUE_APP_TIMEOUT;

// HTTP request 拦截器
axios.interceptors.request.use(
	(config) => {
		let token = getToken("access_token");
		if (token) {
			config.headers[process.env.VUE_APP_TOKEN_NAME] =
				getToken("token_type") + " " + getToken("access_token");
			
		}
		config.headers["lang"] = tool.data.get("APP_LANG")
				? tool.data.get("APP_LANG")
				: process.env.VUE_APP_LANG;
		if (
			process.env.VUE_APP_REQUEST_CACHE !== "true" &&
			config.method == "get"
		) {
			config.params = config.params || {};
			config.params["_"] = new Date().getTime();
		}
		Object.assign(config.headers, JSON.parse(process.env.VUE_APP_HEADERS));
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// HTTP response 拦截器
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			if (error.response.status == 404) {
				ElNotification.error({
					title: this.$t('request.error'),
					message: `Status:404，this.$t('request.404')`,
				});
			} else if (error.response.status == 500) {
				console.log("权限失效");
				if (
					error.response.data.message.indexOf(
						"The refresh token is invalid"
					) === -1 &&
					error.response.data.message.indexOf("Unauthenticated") ===
						-1
				) {
					ElNotification.error({
						title: this.$t('request.error'),
						message:
							error.response.data.message ||
							`Status:500，${this.$t('request.500')}`,
					});
				}
			} else if (error.response.status == 401) {
				if (
					error.response.data.message.code === 50002 ||
					error.response.data.message.code === 50003
				) {
					// to re-login
					ElMessageBox.confirm(
						this.$t('request.reLogin.info'),
						this.$t('request.reLogin.title'),
						{
							confirmButtonText: this.$t('request.reLogin.confirmButtonText'),
							cancelButtonText: this.$t('request.reLogin.cancelButtonText'),
							type: "warning",
						}
					)
						.then(() => {
							this.$TOOL.data.remove("TOKEN")
							this.$TOOL.data.remove("USER_INFO")
							this.$TOOL.data.remove("MENU")
							this.$TOOL.data.remove("PERMISSIONS")
							this.$TOOL.data.remove("APP_LANG")
							this.$TOOL.data.remove("grid")
							this.$store.commit("clearViewTags")
							this.$store.commit("clearKeepLive")
							this.$store.commit("clearIframeList")
							removeToken('access_token')
							removeToken('expires_in')
							removeToken('refresh_token')
							removeToken('token_type')
							router.replace({ path: "/login" });
						})
						.catch(() => {});
				} else {
					ElNotification.error({
						title: this.$t('request.error'),
						message:
							error.response.data.message ||
							`Status:${error.response.status}，${this.$t('request.unknownError')}！`,
					});
				}
			} else {
				ElNotification.error({
					title: this.$t('request.error'),
					message:
						error.response.data.message ||
						`Status:${error.response.status}，${this.$t('request.unknownError')}！`,
				});
			}
		} else {
			ElNotification.error({
				title: this.$t('request.error'),
				message: "请求服务器无响应！",
			});
		}
		return Promise.reject(error.response);
	}
);

var http = {
	/** get 请求
	 * @param  {接口地址} url
	 * @param  {请求参数} params
	 * @param  {参数} config
	 */
	get: function (url, params = {}, config = {}) {
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: url,
				params: params,
				...config,
			})
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** post 请求
	 * @param  {接口地址} url
	 * @param  {请求参数} data
	 * @param  {参数} config
	 */
	post: function (url, data = {}, config = {}) {
		return new Promise((resolve, reject) => {
			axios({
				method: "post",
				url: url,
				data: data,
				...config,
			})
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** put 请求
	 * @param  {接口地址} url
	 * @param  {请求参数} data
	 * @param  {参数} config
	 */
	put: function (url, data = {}, config = {}) {
		return new Promise((resolve, reject) => {
			axios({
				method: "put",
				url: url,
				data: data,
				...config,
			})
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** patch 请求
	 * @param  {接口地址} url
	 * @param  {请求参数} data
	 * @param  {参数} config
	 */
	patch: function (url, data = {}, config = {}) {
		return new Promise((resolve, reject) => {
			axios({
				method: "patch",
				url: url,
				data: data,
				...config,
			})
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** delete 请求
	 * @param  {接口地址} url
	 * @param  {请求参数} data
	 * @param  {参数} config
	 */
	delete: function (url, data = {}, config = {}) {
		return new Promise((resolve, reject) => {
			axios({
				method: "delete",
				url: url,
				data: data,
				...config,
			})
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** jsonp 请求
	 * @param  {接口地址} url
	 * @param  {JSONP回调函数名称} name
	 */
	jsonp: function (url, name = "jsonp") {
		return new Promise((resolve) => {
			var script = document.createElement("script");
			var _id = `jsonp${Math.ceil(Math.random() * 1000000)}`;
			script.id = _id;
			script.type = "text/javascript";
			script.src = url;
			window[name] = (response) => {
				resolve(response);
				document.getElementsByTagName("head")[0].removeChild(script);
				try {
					delete window[name];
				} catch (e) {
					window[name] = undefined;
				}
			};
			document.getElementsByTagName("head")[0].appendChild(script);
		});
	},
};

export default http;
