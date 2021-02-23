<!--suppress ALL -->
<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm" style="padding-left:100px;padding-right:100px;">
      <h3>基本信息</h3>
      <el-form-item label="商品名称" prop="name" style="width:600px;">
        <el-input v-model="ruleForm.name" maxlength="60" clearable/>
      </el-form-item>
      <el-form-item label="货号" prop="number" style="width:400px;">
        <el-input v-model="ruleForm.number" maxlength="50" clearable/>
      </el-form-item>
      <el-form-item label="运费模板" prop="freight_id">
        <el-select v-model="ruleForm.freight_id" clearable placeholder="请选择">
          <el-option
            v-for="item in freight"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <div class="el-upload__tip">请选择商品的所属类型，进而完善此商品的规格</div>
      </el-form-item>
      <el-form-item label="主图" prop="img">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-progress="handleProgress"
          :action="actionurl"
          :headers="imgHeaders"
          :data="imgMasterData"
          class="avatar-uploader">
          <span v-if="imgProgress">
            <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
          </span>
          <span v-else>
            <img v-if="ruleForm.img" :src="ruleForm.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </span>
        </el-upload>
        <div class="el-upload__tip">每张不能大于2M</div>
      </el-form-item>
      <el-form-item label="视频" prop="video" style="width:600px;">
        <el-input v-model="ruleForm.video" clearable placeholder="视频地址" @blur="setVideo"/>
        <el-input v-model="ruleForm.poster" clearable placeholder="封面地址" style="padding-top: 10px;padding-bottom: 10px;" @blur="setPoster"/>
        <video-player
          v-if="ruleForm.video"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          class="video-player vjs-custom-skin"/>
        <div class="el-upload__tip">填写视频地址</div>
      </el-form-item>
      <el-form-item label="图片列表" prop="resource">
        <el-upload
          :limit="5"
          :action="actionurl"
          :headers="imgHeaders"
          :on-success="handleAvatarSuccessList"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUploadList"
          :data="imgData"
          :file-list="ruleForm.imgList"
          multiple
          list-type="picture-card">
          <i slot="default" class="el-icon-plus"/>
        </el-upload>
        <div class="el-upload__tip">最多可上传5张，每张不能大于2M</div>
      </el-form-item>
      <el-form-item label="关键字" prop="keywords" style="width:600px;">
        <el-input v-model="ruleForm.keywords" maxlength="255" clearable/>
      </el-form-item>
      <el-form-item label="短描述" prop="short_description" style="width:600px;">
        <el-input v-model="ruleForm.short_description" maxlength="160" clearable/>
      </el-form-item>
      <h3>商品规格</h3>
      <el-form-item label="类目" prop="category_id">
        <el-cascader
          v-model="ruleForm.category_id"
          :options="goods_type"
          :props="{ expandTrigger: 'hover' }"
          clearable
          @change="goodsType"/>
        <div class="el-upload__tip">请选择商品的所属类型，进而完善此商品的规格</div>
      </el-form-item>
      <el-form-item v-if="goods_brand.length > 0" label="品牌" prop="brand_id">
        <el-select v-model="ruleForm.brand_id" clearable placeholder="请选择" @change="change($event)">
          <el-option
            v-for="item in goods_brand"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(item, i) in good_attribute" :label="item.name" :key="i">
        <el-input v-if="item.type === 1" v-model="ruleForm.good_specification[i]['data']" clearable style="width:400px;" @input="change($event)"/>
        <el-select v-else-if="item.type === 2" v-model="ruleForm.good_specification[i]['data']" clearable placeholder="请选择" @change="change($event)">
          <el-option
            v-for="(list, index) in item.value"
            :key="index"
            :label="list"
            :value="index"/>
        </el-select>
        <el-select v-else v-model="ruleForm.good_specification[i]['data']" clearable multiple placeholder="请选择" @change="change($event)">
          <el-option
            v-for="(list, index) in item.value"
            :key="index"
            :label="list"
            :value="index"/>
        </el-select>
      </el-form-item>
      <sku ref="SkuDemo"/>
      <h3>详情</h3>
      <el-form-item label="详情" prop="details">
        <tinymce
          ref="editor"
          v-model="ruleForm.details"
          :disabled="disabled"
          :url="actionurl"
          :header="imgHeaders"/>
      </el-form-item>
      <h3>设置</h3>
      <el-form-item label="上架时间" prop="is_show">
        <el-radio-group v-model="ruleForm.is_show">
          <el-radio :label="0">暂不售卖，放入仓库</el-radio>
          <el-radio :label="1">立即上架售卖</el-radio>
          <el-radio :label="2">定时上架
            <el-date-picker
              :disabled="ruleForm.is_show === 2 ? false : true"
              v-model="ruleForm.timing"
              type="date"
              placeholder="选择日期时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"/>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="减库存方式" prop="is_inventory">
        <el-radio-group v-model="ruleForm.is_inventory">
          <el-radio :label="0">拍下减库存</el-radio>
          <el-radio :label="1">付款减库存</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否推荐" prop="is_recommend">
        <el-radio-group v-model="ruleForm.is_recommend">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否新品" prop="is_new">
        <el-radio-group v-model="ruleForm.is_new">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否热销" prop="is_hot">
        <el-radio-group v-model="ruleForm.is_hot">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-radio-group v-model="ruleForm.sort">
          <el-input v-model="ruleForm.sort" maxlength="11" clearable style="width:80px;"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="float-button">
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .createPost-container{
    padding-bottom: 60px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 188px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 188px;
    height: 188px;
    display: block;
  }
  .avatar-uploaders .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploaders .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icons {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .progress-imgs{
    padding: 5px;
  }
  .float-button{
    position: fixed;
    bottom: 0px;
    right: 0;
    padding-right: 10%;
    padding-top:10px;
    padding-bottom: 10px;
    width: 100%;
    margin-bottom: 0;
    background-color: #ffffff;
    text-align: right;
    z-index: 999;
    line-height: 50px;
    border-top: 1px solid #e5e5e5;
  }
</style>
<script>
import { detail, create, edit, specification } from '@/api/Good'
import { getToken } from '@/utils/auth'
import tinymce from '@/components/tinymce5'
import Sku from '@/components/skutwo'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  name: 'GoodDetail',
  components: {
    tinymce,
    Sku,
    videoPlayer
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      const pattern = /^\d+.?\d{0,2}$/
      if (value) {
        if (!pattern.test(value)) {
          callback(new Error('只允许数字，并小数点后最多只能输入两位2'))
        }
      }
      callback()
    }
    return {
      formLoading: false,
      dialogFormVisible: false,
      // 视频播放
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: '',
          src: '' // url地址
        }],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      freight: [],
      disabled: false,
      sku: [],
      goods_brand: [],
      attributeMarket: [],
      dialogImageUrl: '',
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      good_attribute: [],
      goods_type: [],
      imgMasterData: {
        type: 1,
        size: 1024 * 1024 * 2,
        specification: [80, 150, 200, 250, 300, 350]
      },
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      dialogVisible: false,
      loading: false,
      id: '',
      ruleForm: {
        name: '',
        category_id: '',
        number: '',
        brand_id: null,
        inventory: '',
        good_specification: [],
        market_price: '',
        price: '',
        keywords: '',
        short_description: '',
        details: '',
        img: '',
        cost_price: '',
        is_show: 1,
        is_recommend: 0,
        is_new: 0,
        is_hot: 0,
        is_inventory: 0,
        sort: 5,
        freight_id: ''
      },
      imgProgress: false,
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入货号', trigger: 'blur' }
        ],
        freight_id: [
          { required: true, message: '请选择运费模板', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传主图', trigger: 'change' }
        ],
        market_price: [
          { required: false, validator: validatePrice, message: '只允许数字，并小数点后最多只能输入两位', trigger: 'blur' }
        ],
        cost_price: [
          { required: false, validator: validatePrice, message: '只允许数字，并小数点后最多只能输入两位', trigger: 'blur' }
        ],
        price: [
          { required: false, validator: validatePrice, message: '只允许数字，并小数点后最多只能输入两位', trigger: 'blur' }
        ],
        inventory: [
          { required: false, message: '只能输入整数', trigger: 'blur' }
        ],
        brand_id: [
          { required: true, message: '请选择品牌', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择类目', trigger: 'blur' }
        ],
        details: [
          { required: true, message: '请输入详情', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      detail(this.id ? this.id : 0, { category: getToken('applyCategory') }).then(response => {
        if (this.id > 0) {
          this.ruleForm = response.data.goods
          this.goodsType(true)
          this.dialogStatus = 'update'
          this.$refs.SkuDemo._setData(this.ruleForm.good_sku)
          if (this.ruleForm.video) {
            this.playerOptions['sources'][0]['src'] = this.ruleForm.video
          }
          if (this.ruleForm.poster) {
            this.playerOptions['poster'] = this.ruleForm.poster
          }
        }
        this.goods_type = response.data.category
        this.freight = response.data.freight
        this.loading = false
      })
    },
    create() { // 添加
      this.formLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.good_sku = this.getSkuData()
          create(this.ruleForm).then(() => {
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
            this.formLoading = false
            setTimeout(this.$router.back(-1), 2000)
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    edit() { // 更新
      this.formLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.good_sku = this.getSkuData()
          edit(this.ruleForm).then(() => {
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
            this.formLoading = false
            setTimeout(this.$router.push({ path: '/commodityManagement/good/goodList?page=' + this.$route.query.page + '&activeIndex=' + this.$route.query.activeIndex }), 2000)
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.ruleForm.img = file.response
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent
    },
    // 图片格式大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.imgProgress = true
      return isLt2M
    },
    // 图片列表图片格式大小验证
    beforeAvatarUploadList(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 图片列表上传成功
    handleAvatarSuccessList(res, file, fileList) {
      this.ruleForm.imgList = fileList
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.ruleForm.imgList = fileList
    },
    // 添加销售规格
    addAttribute(res) {
      if (!this.attributeMarket[res.id]) {
        this.$set(this.attributeMarket, res.id, [{ img: '', name: '', typename: res.name }])
      } else {
        this.attributeMarket[res.id].push({
          img: '',
          name: '',
          typename: res.name
        })
      }
    },
    // 显示规格
    goodsType(state) {
      let category_id = null
      if (this.ruleForm.category_id.length) {
        category_id = this.ruleForm.category_id[this.ruleForm.category_id.length - 1]
      } else {
        if (this.ruleForm.category_id.length === 0) {
          category_id = null
        } else {
          category_id = this.ruleForm.category_id
        }
      }
      if (category_id) {
        specification(category_id).then(response => {
          this.ruleForm.good_specification = []
          if (!state) {
            this.ruleForm.brand_id = null
          }
          this.goods_brand = []
          this.good_attribute = []
          const that = this
          if (response.data.specification_on.length > 0) {
            this.good_attribute = response.data.specification_on
            response.data.specification_on.forEach(function(item, index) {
              if (that.ruleForm.good_specification_old && that.ruleForm.good_specification_old.length > 0 && state) {
                const index = that.ruleForm.good_specification_old.findIndex(items => {
                  return items.specification_id === item.id
                })
                if (index === -1) { // 没有相同数据
                  that.ruleForm.good_specification.push({
                    specification_id: item.id,
                    data: null
                  })
                } else {
                  that.ruleForm.good_specification.push(that.ruleForm.good_specification_old[index])
                }
              } else {
                that.ruleForm.good_specification.push({
                  specification_id: item.id,
                  data: null
                })
              }
            })
          } else {
            this.good_attribute = []
          }
          if (response.data.brand_on.length > 0) {
            this.ruleForm.brand_id = this.ruleForm.brand_id ? this.ruleForm.brand_id : null
            this.goods_brand = response.data.brand_on
          }
        })
      }
    },
    // 得到 sku 数据
    getSkuData() {
      const product_skus = this.$refs.SkuDemo._getData().map(item => {
        const { id, format, img, market_price, cost_price, price, inventory, skus } = item
        const skuText = skus.reduce(
          (str, prev) => `${str}${prev.k}：${prev.v}——`,
          '',
        )
        if (market_price === '') {
          this.$message.error(skuText + ' 未输入市场价')
          throw new Error('请输入市场价')
        } else if (cost_price === '') {
          this.$message.error(skuText + ' 未输入成本价')
          throw new Error('请输入成本价')
        } else if (price === '') {
          this.$message.error(skuText + ' 未输入销售价')
          throw new Error('请输入销售价')
        } else if (inventory === '') {
          this.$message.error(skuText + ' 未输入库存')
          throw new Error('请输入库存')
        }
        return {
          id,
          format,
          img,
          market_price,
          cost_price,
          price,
          inventory,
          product_sku: skus.map(sku => ({
            key: sku.k,
            value: sku.v
          }))
        }
      })
      return product_skus
    },
    // 设置视频地址
    setVideo(event) {
      this.playerOptions['sources'][0]['src'] = this.ruleForm.video
    },
    // 设置视频封面
    setPoster(event) {
      this.playerOptions['poster'] = this.ruleForm.poster
    },
    // 重新加载无法输入或选择
    change(e) {
      this.$forceUpdate()
    }
  }
}
</script>
