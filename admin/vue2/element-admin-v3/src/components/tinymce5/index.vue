<template>
  <div class="tinymce-box">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"/>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import 'tinymce/icons/default/icons.min.js'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import 'tinymce/plugins/code'// HTML编辑
import 'tinymce/plugins/fullscreen'// 全屏
import 'tinymce/plugins/link'// 链接
import 'tinymce/plugins/preview'// 预览
import '../../../static/tinymce/plugins/axupimgs/plugin'// 多图批量上传

export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  props: {
    url: {
      default: '',
      type: String
    },
    accept: {
      default: 'image/jpeg, image/png, image/gif',
      type: String
    },
    maxSize: {
      default: 1024 * 1024 * 2,
      type: Number
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table link wordcount code fullscreen preview axupimgs'
    },
    toolbar: {
      type: [String, Array],
      default: 'axupimgs media lists table link | undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent  | removeformat code fullscreen image preview'
    },
    header: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      init: {
        language_url: './static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: './static/tinymce/skins/ui/oxide',
        content_css: `./static/tinymce/skins/content/default/content.css`,
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          if (blobInfo.blob().size > this.maxSize) {
            failure('文件体积过大')
          }
          if (this.accept.indexOf(blobInfo.blob().type) >= 0) {
            const xhr = new XMLHttpRequest()
            const formData = new FormData()
            const self = this
            xhr.withCredentials = false
            xhr.open('POST', self.url)
            xhr.setRequestHeader('Authorization', self.header.Authorization)
            xhr.onload = function() {
              if (xhr.status !== 200) {
                // 抛出 'on-upload-fail' 钩子
                self.$emit('on-upload-fail')
                failure('上传失败: ' + JSON.parse(xhr.response).message)
                return
              }
              success(xhr.responseText)
            }
            formData.append('file', blobInfo.blob())
            formData.append('type', 1)
            formData.append('size', this.maxSize)
            xhr.send(formData)
          } else {
            failure('图片格式错误')
          }
        }
      },
      myValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    }
  }
}
</script>
