<template>
	<div class="sceditor">
		<Editor v-model="contentValue" :init="init" :disabled="disabled" :placeholder="placeholder" @onClick="onClick" />
	</div>
</template>

<script>
	import API from "@/api";
	import Editor from '@tinymce/tinymce-vue'
	import tinymce from 'tinymce/tinymce'
	import 'tinymce/themes/silver'
	import 'tinymce/icons/default'
	import 'tinymce/models/dom'

	// 引入编辑器插件
	import 'tinymce/plugins/code'  //编辑源码
	import 'tinymce/plugins/image'  //插入编辑图片
	import 'tinymce/plugins/media'  //插入视频
	import 'tinymce/plugins/link'  //超链接
	import 'tinymce/plugins/preview'//预览
	import 'tinymce/plugins/template'//模板
	import 'tinymce/plugins/table'  //表格
	import 'tinymce/plugins/pagebreak'  //分页
	import 'tinymce/plugins/lists'  //列
	import 'tinymce/plugins/advlist'  //列
	import 'tinymce/plugins/quickbars'  //快速工具条

	export default {
		components: {
			Editor
		},
		props: {
			modelValue: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: ""
			},
			height: {
				type: Number,
				default: 300,
			},
			disabled: {
				type: Boolean,
				default: false
			},
			plugins: {
				type: [String, Array],
				default: 'code image media link preview table quickbars template pagebreak lists advlist'
			},
			toolbar: {
				type: [String, Array],
				default: 'undo redo |  forecolor backcolor bold italic underline strikethrough link | blocks fontfamily fontsize | \
					alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | pagebreak | \
					image media table template preview | code selectall'
			},
			templates: {
				type: Array,
				default: () => []
			},
			options: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				init: {
					language_url: 'tinymce/langs/zh_CN.js',
					language: 'zh_CN',
					skin_url: 'tinymce/skins/ui/oxide',
					content_css: "tinymce/skins/content/default/content.css",
					menubar: false,
					statusbar: true,
					plugins: this.plugins,
					toolbar: this.toolbar,
					font_size_formats: '12px 14px 16px 18px 22px 24px 36px 72px',
					height: this.height,
					placeholder: this.placeholder,
					branding: false,
					resize: true,
					elementpath: true,
					content_style: "",
					templates: this.templates,
					quickbars_selection_toolbar: 'forecolor backcolor bold italic underline strikethrough link',
					quickbars_image_toolbar: 'alignleft aligncenter alignright',
					quickbars_insert_toolbar: false,
					image_caption: true,
					image_advtab: true,
					convert_urls: false,
					images_upload_handler: function(blobInfo) {
						return new Promise((resolve, reject) => {
							const data = new FormData();
							data.append("file", blobInfo.blob() ,blobInfo.filename());
							data.append("uuid",'c5b8ffd0-5892-11ec-a943-3fd5d59f340c');
							API.common.upload.post(data).then((res) => {
								resolve(res.message.url)
							}).catch(() => {
								reject("Image upload failed")
							})
						})
					},
					setup: function(editor) {
						editor.on('init', function() {
							this.getBody().style.fontSize = '14px';
						})

					},
					...this.options
				},
				contentValue: this.modelValue
			}
		},
		watch: {
			modelValue(val) {
				this.contentValue = val
			},
			contentValue(val){
				this.$emit('update:modelValue', val);
			}
		},
		mounted() {
			tinymce.init({})
		},
		methods: {
			onClick(e){
				this.$emit('onClick', e, tinymce)
			}
		}
	}
</script>

<style>
</style>
