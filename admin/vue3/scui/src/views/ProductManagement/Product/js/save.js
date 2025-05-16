import { defineAsyncComponent } from 'vue';
const scEditor = defineAsyncComponent(() => import('@/components/scEditor'));
import { ElMessage, ElMessageBox } from 'element-plus'
import codeDialog from "../code";
export default {
	emits: ["success", "closed"],
	components: {
		scEditor,
		codeDialog
	},
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增商品",
				edit: "编辑商品",
				show: "查看商品",
			},
			dialog: {
				code: false,
			},
			plugins: "code image media link preview table quickbars template pagebreak lists advlist",
			toolbar: "undo redo | forecolor backcolor image | blocks fontfamily fontsize | \
					alignleft aligncenter alignright alignjustify | bold italic underline strikethrough | outdent indent | numlist bullist | \
					media table link code selectall",
			visible: false,
			isSaveing: false,
			hasChildren: false,
			//表单数据
			form: {
				type: 0,
				img: [],
				video: "",
				video_img: "",
				name: "",
				id: "",
				category_id: "",
				specification_type: 0,
				freight_type: 0,
				is_inventory: 0,
				is_recommend: 0,
				inventory: "",
				number: "",
				sort: 5,
				is_show: 0,
				freight: "",
				freight_id: "",
				timing: "",
				market_price: "",
				cost_price: "",
				price: "",
				code_type: 0,
				is_fixed: 1,
				good_code: [],
				good_sku: [],
				download: "",
				keywords: "",
				short_description: ""
			},
			goodSkuSpecification: [],
			categoryList: [],
			freightList: [],
			addTemplate: {
				name: '',
				code: '',
				state: 0,
			},
			addGoodSkuSpecificationTemplate: {
				id: '',
				parent: '',
				children: [],
			},
			//验证规则
			rules: {
				download: [
					{
						required: true,
						message: "请上传下载文件",
					},
				],
				code_type: [
					{
						required: true,
						message: "请选择卡密类型",
					},
				],
				is_fixed: [
					{
						required: true,
						message: "请选择是否固定卡密",
					},
				],
				inventory: [
					{
						required: true,
						message: "请输入库存",
					},
				],
				market_price: [
					{
						required: true,
						message: "请输入划线价",
					},
				],
				cost_price: [
					{
						required: true,
						message: "请输入成本价",
					},
				],
				price: [
					{
						required: true,
						message: "请输入售价",
					},
				],
				name: [
					{
						required: true,
						message: "请输入快递公司名称",
					},
				],
				img: [
					{
						required: true,
						message: "请上传商品轮播图",
					},
				],
				category_id: [
					{
						required: true,
						message: "请选择商品分类",
					},
				],
				specification_type: [
					{
						required: true,
						message: "请选择规模类型",
					},
				],
				freight_type: [
					{
						required: true,
						message: "请选择物流方式",
					},
				],
				freight_id: [
					{
						required: true,
						message: "请选择运费模板",
					},
				],
				freight: [
					{
						required: true,
						message: "请输入运费",
					},
				],
				is_show: [
					{
						required: true,
						message: "请选择上架时间",
					},
				],
				is_inventory: [
					{
						required: true,
						message: "请选择减库存方式",
					},
				],
				is_recommend: [
					{
						required: true,
						message: "请选择是否推荐",
					},
				],
				sort: [
					{
						required: true,
						message: "请输入排序",
					},
				],
				good_code: [
					{
						required: true,
						message: "请添加卡密/网盘数据",
					},
				],
			},
		};
	},
	mounted() {
		this.getCategory()
		this.getFreight()
	},
	computed: {
		// sku子规格数据
		skuLineData: {
			get() {
				if (this.goodSkuSpecification.length === 0) return [];
				const allChildren = this.goodSkuSpecification.map(spec => spec.children);
				const sku = this.cartesianProduct(...allChildren).map(combination => {
					const product_sku = combination.map((value, index) => ({
						key: this.goodSkuSpecification[index].parent,
						value
					}));
					let pid = product_sku.reduce((acc, cur) => acc + cur.key + cur.value, '');
					let pidData = this.form.good_sku.find(item => item.pid === pid)
					// 同步原来填写的信息
					if (pidData) {
						return pidData;
					} else {
						return { pid: pid, product_sku, img: '', price: '', cost_price: '', market_price: '', inventory: '', code_type: 0, is_fixed: 1, download: '', good_code: [] };
					}
				});

				this.form.good_sku = sku
				return sku
			},
			set(newValue) {
				this.form.good_sku = newValue
			}
		}
	},
	methods: {
		//添加
		table_add(index) {
			this.dialog.code = true;
			this.$nextTick(() => {
				this.$refs.codeDialog.open("add", index);
			});
		},
		//编辑
		table_edit(row, index) {
			this.dialog.code = true;
			this.$nextTick(() => {
				this.$refs.codeDialog.open("edit", index).setData(row);
			});
		},
		//本地更新数据
		handleSuccess(data, index) {
			this.form.good_sku[index].code_type = data.code_type
			this.form.good_sku[index].good_code = data.good_code
			this.form.good_sku[index].is_fixed = data.is_fixed
		},
		// 笛卡尔积函数：用于生成所有规格的组合
		cartesianProduct(...arrays) {
			return arrays.reduce((acc, curr) => {
				if (curr.length === 0) {
					// 如果当前处理的数组为空，直接返回累计器acc不变
					return acc.map(item => item);
				}
				return acc.flatMap(d => curr.map(e => [...d, e]));
			}, [[]]);
		},
		// 切换卡密和网盘
		handleCode() {
			this.form.good_code = []
		},
		// 上传卡密
		handleUpload() {
			ElMessageBox.prompt(this.form.code_type === 0 ? `卡密` : `网盘`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputType: 'textarea',
				inputPlaceholder: this.form.code_type === 0 ? `每行一条卡密，第行格式：卡号1:卡密1` : `每行一条网盘数据，第行格式：网盘地址1:提取码1`
			})
				.then(({ value }) => {
					const data = value.split(/[(\r\n)\r\n]+/)
					let line = null
					for (const dataKey in data) {
						line = data[dataKey].split(':')
						if (line.length < 2) {
							ElMessage({
								type: 'info',
								message: `卡密格式有误`,
							})
							return false
						}
						this.form.good_code.push({
							name: line[0],
							code: line[1]
						})
					}
				})
				.catch(() => { })
		},
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		// 获取全部分类列表
		async getCategory() {
			const response = await this.$API.category.list.get({ all: true, state: 0 });
			this.categoryList = response.message;
		},
		// 获取全部运费模板列表
		async getFreight() {
			const response = await this.$API.freight.list.get({ all: true });
			this.freightList = response.message;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.form.id) {
						try {
							const res = await this.$API.product.edit.post(
								this.form
							);
							if (!res) {
								return false;
							}
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					} else {
						try {
							const res = await this.$API.product.create.post(
								this.form
							);
							if (!res) {
								return false;
							}
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					}
				} else {
					return false;
				}
			});
		},
		//表单注入数据
		setData(data) {
			Object.assign(this.form, data);
			if (data.type === "普通商品") {
				this.form.type = 0;
			} else if (data.type === "虚拟商品") {
				this.form.type = 1;
			} else if (data.type === "卡密/网盘") {
				this.form.type = 2;
			} else if (data.type === "下载商品") {
				this.form.type = 3;
			}
			this.goodSkuSpecification = this.transformData(data.good_sku)
			this.form.specification_type = data.good_sku.length ? 1 : 0;
			this.form.is_recommend = data.is_recommend === "是" ? 1 : 0;
			this.form.freight_type = data.freight_type === "固定邮费" ? 0 : 1;
			this.form.is_inventory = data.is_inventory === "拍下减库存" ? 0 : 1;
			this.form.is_show = data.is_show === "定时上架" ? 2 : data.is_show === "已上架" ? 1 : 0;
		},
		transformData(data) {
			// 提取所有的key和value，构建对应的Set和Map
			const keys = new Set(data.flatMap(item => item.product_sku.map(sku => sku.key)));
			const keyValueMap = new Map();
			const skuLineData = [];
			data.forEach(item => item.product_sku.forEach(sku => {
				if (!keyValueMap.has(sku.key)) {
					keyValueMap.set(sku.key, new Set());
				}
				keyValueMap.get(sku.key).add(sku.value);
				let product_sku = item.product_sku
				let pid = product_sku.reduce((acc, cur) => acc + cur.key + cur.value, '');
				skuLineData.push({
					id: item.id, pid: pid, product_sku, img: item.img, price: item.price, cost_price: item.cost_price, market_price: item.market_price, inventory: item.inventory, code_type: item.code_type, is_fixed: item.is_fixed, download: item.download, good_code: item.good_code
				})
			}));
			this.skuLineData = skuLineData
			// 构建最终的goodSkuSpecification格式
			return Array.from(keys).map((key, index) => ({
				id: index + 1,
				parent: key,
				children: Array.from(keyValueMap.get(key)).map(child => isNaN(Number(child)) ? child : Number(child))
			}));
		}
	},
};
