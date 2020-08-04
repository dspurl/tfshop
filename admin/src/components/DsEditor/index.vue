<template>
  <div class="ds-editor">
    <!-- 功能 -->
    <el-col class="top">
      <el-card :body-style="{ padding: '0px' }" shadow="always">
        <el-tooltip class="item" effect="dark" content="图片" placement="bottom-start">
          <span class="el-icon-picture-outline" @click="addLabel('img')"/>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="文本" placement="bottom-start">
          <span class="el-icon-edit-outline" @click="addLabel('text')"/>
        </el-tooltip>
        <span class="el-icon-question" style="float:right;margin-right: 10px;" @click="helpVisible = true"/>
      </el-card>
    </el-col>
    <div class="grid-layout" @click="hidePanel">
      <el-scrollbar style="height: 100%;padding-top:10px;" class="grid-scrollbar">
        <grid-layout
          :layout.sync="layout"
          :col-num="24"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[0, 0]"
          :use-css-transforms="true">

          <grid-item
            v-for="(item, index) in layout"
            :id="'myPanel' + index"
            :key="index + item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :class="{ on : item.on }"
            class="grid-item">
            <div style="width:100%;height: 100%;" @click="checkedLableEvent(item, index)" @dblclick="dblclickImg(item)">
              <div
                v-if="item.t === 'text'"
                :style="{
                  'width': '100%',
                  'height': '100%',
                  'font-size': item.type.font_size + 'px',
                  'font-weight': item.type.font_weight,
                  'color': item.type.color,
                  'line-height': item.type.line_height + 'px',
                  'text-decoration': item.type.text_decoration,
                  'text-align': item.type.text_align,
                  'border-width': item.border.width ? item.border.width + 'px' : '',
                  'border-style': item.border.style,
                  'border-color': item.border.color,
                  'padding-top': item.padding.top + 'px',
                  'padding-right': item.padding.right + 'px',
                  'padding-left': item.padding.left + 'px',
                  'padding-bottom': item.padding.bottom + 'px',
                  'margin-top': item.margin.top + 'px',
                  'margin-right': item.margin.right + 'px',
                  'margin-left': item.margin.left + 'px',
                  'margin-bottom': item.margin.bottom + 'px',
                  'background-color': item.background.color }">
                {{ item.content }}
              </div>
              <div
                v-else-if="item.t === 'img'"
                :style="{
                  'width': '100%',
                  'height': '100%',
                  'font-size': item.type.font_size + 'px',
                  'font-weight': item.type.font_weight,
                  'color': item.type.color,
                  'line-height': item.type.line_height + 'px',
                  'text-decoration': item.type.text_decoration,
                  'text-align': item.type.text_align,
                  'border-width': item.border.width ? item.border.width + 'px' : '',
                  'border-style': item.border.style,
                  'border-color': item.border.color,
                  'padding-top': item.padding.top + 'px',
                  'padding-right': item.padding.right + 'px',
                  'padding-left': item.padding.left + 'px',
                  'padding-bottom': item.padding.bottom + 'px',
                  'margin-top': item.margin.top + 'px',
                  'margin-right': item.margin.right + 'px',
                  'margin-left': item.margin.left + 'px',
                  'margin-bottom': item.margin.bottom + 'px',
                  'background-color': item.background.color }">
                <el-image :src="item.img" style="width: 100%;height:100%;">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </el-image>
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </el-scrollbar>
    </div>
    <!-- 操作 -->
    <el-card v-if="boxCard" :body-style="{ padding: '10px', height: '370px', 'overflow-y': 'auto' }" class="box-card-right">
      <div slot="header" class="clearfix">
        <span>设置面板</span>
        <el-button style="float: right; padding: 3px 0;font-size: 20px;" type="text" class="el-icon-close" @click="boxCard = false"/>
      </div>
      <el-scrollbar style="height: 100%;" class="grid-scrollbar">
        <el-collapse v-model="boxCardRight" accordion>
          <el-collapse-item v-if="temp.t === 'text'" title="内容" name="1">
            <el-form ref="contentForm" label-width="60px" style="margin-right: 5px;">
              <el-input v-model="temp.content" type="textarea" autosize size="mini" clearable placeholder="请输入内容"/>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="类型" name="2">
            <el-form ref="dataForm" :model="temp.type" label-width="60px" style="margin-right: 5px;">
              <el-form-item label="字号">
                <el-input v-model="temp.type.font_size" size="mini" maxlength="16" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="字体粗细">
                <el-select v-model="temp.type.font_weight" clearable size="mini" placeholder="请选择">
                  <el-option label="正常" value="normal"/>
                  <el-option label="加粗" value="bold"/>
                </el-select>
              </el-form-item>
              <el-form-item label="宽">
                <el-select v-model="temp.w" size="mini" placeholder="请选择" style="width:120px;">
                  <el-option
                    v-for="item in typeWidth"
                    :key="item"
                    :label="item + '格'"
                    :value="item"/>
                </el-select>
                <el-tooltip class="item" effect="dark" content="宽为网络模式，共24格" placement="bottom-start">
                  <span class="el-icon-question" style="color: #909399"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="高">
                <el-input v-model.number="temp.h" size="mini" maxlength="16" clearable style="width:120px;"/>
                <el-tooltip class="item" effect="dark" content="高的结果都将*30，可以理解为30PX一行" placement="bottom-start">
                  <span class="el-icon-question" style="color: #909399"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="行高">
                <el-input v-model.number="temp.type.line_height" size="mini" maxlength="16" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="字体颜色">
                <el-color-picker v-model="temp.type.color"/>
              </el-form-item>
              <el-form-item label="文本修饰">
                <el-select v-model="temp.type.text_decoration" clearable size="mini" placeholder="请选择">
                  <el-option label="下划线" value="underline"/>
                  <el-option label="上划线" value="overline"/>
                  <el-option label="删除线" value="line-through"/>
                  <el-option label="无" value="none"/>
                </el-select>
              </el-form-item>
              <el-form-item label="对齐方式"/>
              <el-radio-group v-model="temp.type.text_align" size="mini">
                <el-radio-button label="left">左对齐</el-radio-button>
                <el-radio-button label="center">居中</el-radio-button>
                <el-radio-button label="right">右对齐</el-radio-button>
                <el-radio-button label="justify">两端对齐</el-radio-button>
              </el-radio-group>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="边框" name="3">
            <el-form ref="dataForm" :model="temp.border" label-width="60px" style="margin-right: 5px;">
              <el-form-item label="宽度">
                <el-input v-model="temp.border.width" size="mini" maxlength="16" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="temp.border.style" clearable size="mini" placeholder="请选择">
                  <el-option label="点线" value="dotted"/>
                  <el-option label="虚线" value="dashed"/>
                  <el-option label="直线" value="solid"/>
                  <el-option label="无" value="none"/>
                </el-select>
              </el-form-item>
              <el-form-item label="颜色">
                <el-color-picker v-model="temp.border.color"/>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="内边距" name="4">
            <el-form ref="dataForm" label-width="60px" style="margin-right: 5px;">
              <el-form-item label="上">
                <el-input v-model="temp.padding.top" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="下">
                <el-input v-model="temp.padding.bottom" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="左">
                <el-input v-model="temp.padding.left" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="右">
                <el-input v-model="temp.padding.right" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="外边距" name="5">
            <el-form ref="dataForm" label-width="60px" style="margin-right: 5px;">
              <el-form-item label="上">
                <el-input v-model="temp.margin.top" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="下">
                <el-input v-model="temp.margin.bottom" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="左">
                <el-input v-model="temp.margin.left" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
              <el-form-item label="右">
                <el-input v-model="temp.margin.right" autosize size="mini" clearable style="width:160px;">
                  <template slot="append">PX</template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="背景" name="6">
            <el-form ref="dataForm" label-width="60px" style="margin-right: 5px;">
              <el-form-item label="背景颜色">
                <el-color-picker v-model="temp.background.color"/>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-button type="danger" round style="width:100%;margin-top: 20px;" @click="deleteLableEvent()">删除</el-button>
        </el-collapse>
      </el-scrollbar>
    </el-card>

    <!--添加-->
    <el-dialog :visible.sync="dialogFormVisible" title="图片选取">
      <el-form ref="imgForm" :model="tempImg" label-position="left">
        <el-tabs tab-position="left" style="height: 400px;">
          <el-tab-pane label="上传图片">
            <el-upload
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-progress="handleProgress"
              :action="actionurl"
              :headers="imgHeaders"
              :data="imgData"
              class="avatar-uploader">
              <span v-if="imgProgress">
                <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
              </span>
              <span v-else>
                <img v-if="tempImg.uploadingImg" :src="tempImg.uploadingImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </span>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="本地资源">暂无</el-tab-pane>
          <el-tab-pane label="网络图片">
            <el-input v-model="tempImg.networkImg" clearable placeholder="网络图片地址"/>

            <el-image v-if="tempImg.networkImg" :src="tempImg.networkImg" fit="scale-down" style="width: 400px; height: 400px">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button type="primary" @click="selectedImage()">确定</el-button>
      </div>
    </el-dialog>

    <!--帮助-->
    <el-dialog
      :visible.sync="helpVisible"
      title="帮助"
      width="30%">
      <p><b>版本：</b></p>
      <p>V0.001</p>
      <p>当前版本支持图片和文本添加</p>
      <p><b>操作：</b></p>
      <p>点击添加的控件，右边就可以对该控件进行属性编辑</p>
      <p>如图片控件，长按可选择图片</p>
      <p>图片控件，如果不添加图片，保存时将会自动删除</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="helpVisible = false">取 消</el-button>
        <el-button type="primary" @click="helpVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import { getToken } from '@/utils/auth'
export default {
  name: 'DsEditeor',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    layouts: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      layout: this.layouts,
      helpVisible: false,
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      imgProgressPercent: 0,
      dialogFormVisible: false,
      boxCard: false,
      typeWidth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      boxCardRight: ['1'],
      tempImg: {},
      lableIndex: -1,
      imgProgress: false,
      temp: {
        'on': false,
        'x': 0,
        'y': 0,
        'w': 0,
        'h': 0,
        type: {
          width: 0,
          height: 0,
          font_weight: '',
          color: '#303133',
          line_height: '',
          text_align: '',
          text_decoration: ''
        },
        content: '',
        border: {
          width: '',
          color: '',
          style: ''
        },
        padding: {
          top: '',
          bottom: '',
          left: '',
          right: ''
        },
        margin: {
          top: '',
          bottom: '',
          left: '',
          right: ''
        },
        background: {
          color: '#FFFFFF'
        }
      }
    }
  },
  watch: {
    layouts() {
      this.layouts = this.layout
    }
  },
  methods: {
    // 添加标签
    addLabel(lable) {
      var data = {}
      var y = 0
      var w = 24
      var h = 2
      var lableIndex = this.lableIndex
      var layout = this.layout
      this.layout.map(function(name, id) {
        y += name.h
      })
      switch (lable) {
        case 'text':
          data = {
            'on': false,
            'x': 0,
            'y': y,
            'w': w,
            'h': h,
            'i': this.layout.length,
            't': lable,
            type: {
              width: w,
              height: h,
              font_weight: '',
              color: '#303133',
              line_height: '',
              text_align: '',
              text_decoration: ''
            },
            content: '这是文字' + this.layout.length,
            border: {
              width: '',
              color: '',
              style: ''
            },
            padding: {
              top: '',
              bottom: '',
              left: '',
              right: ''
            },
            margin: {
              top: '',
              bottom: '',
              left: '',
              right: ''
            },
            background: {
              color: '#FFFFFF'
            }
          }
          break
        case 'img':
          h = 8
          data = {
            'on': false,
            'x': 0,
            'y': y,
            'w': w,
            'h': h,
            'i': this.layout.length,
            't': lable,
            type: {
              width: w,
              height: h,
              font_weight: '',
              color: '#303133',
              line_height: '',
              text_align: '',
              text_decoration: ''
            },
            img: '',
            border: {
              width: '',
              color: '',
              style: ''
            },
            padding: {
              top: '',
              bottom: '',
              left: '',
              right: ''
            },
            margin: {
              top: '',
              bottom: '',
              left: '',
              right: ''
            },
            background: {
              color: '#FFFFFF'
            }
          }
          break
      }
      if (lableIndex >= 0) { // 当有选中图层时
        // 位置定位只支持Y不支持X
        data.y = layout[lableIndex].y + layout[lableIndex].h
        layout.map(function(name, id) {
          if (name.y === data.y) {
            layout[id].y = y
          }
        })
      }
      this.layout.push(data)
    },
    // 点击标签
    checkedLableEvent: function(item, index) {
      this.layout.map(function(name) {
        name.on = false
      })
      this.layout[index].on = true
      // 弹出设置面板
      this.boxCard = true
      this.temp = item
      this.lableIndex = index
    },
    // 双击选择图片
    dblclickImg(item) {
      if (item.t === 'img') {
        this.tempImg = {}
        this.dialogFormVisible = true
        this.tempImg = item
      }
    },
    // 删除
    deleteLableEvent() {
      this.layout.splice(this.lableIndex, 1)
      this.lableIndex = -1 // 设置当前为未选中状态
      this.boxCard = false
      this.dialogFormVisible = false
    },
    hidePanel: function(event) {
      if (event.target.className === 'el-scrollbar__wrap') {
        this.layout.map(function(name) {
          name.on = false
        })
        this.boxCard = false
      }
    },
    // 选定图片
    selectedImage() {
      if (!this.tempImg.uploadingImg && !this.tempImg.networkImg) {
        this.$message.error('请选择图片')
        return false
      } else {
        if (this.tempImg.uploadingImg) {
          this.tempImg.img = this.tempImg.uploadingImg
        } else if (this.tempImg.networkImg) {
          this.tempImg.img = this.tempImg.networkImg
        }
        this.dialogFormVisible = false
        this.lableIndex = -1
      }
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.tempImg.uploadingImg = file.response
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
    }
  }
}
</script>
<style>
  .grid-scrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .grid-item>.vue-resizable-handle{
    display: none;
  }
  .grid-item.on>.vue-resizable-handle{
    display: block;
  }
  .box-card-right .el-form-item__label{
    font-size: 12px;
    line-height: 35px;
    font-weight: normal;
  }
  .image-slot{
    width: 100%;
    height:100%;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
  }
  .image-slot i{
    font-size: 45px;
    color: #909399;
  }
</style>
<style scoped>
  .ds-editor .grid-layout{
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: .3s;
    height: 400px !important;
    overflow-y: auto;
  }

  .ds-editor .grid-item.on{
    border: 2px dashed #DCDFE6;
  }
  .ds-editor .top{
    width: 100%;
    height:45px;
  }
  .ds-editor .top span{
    font-size: 22px;
    padding-left: 10px;
    line-height: 45px;
    cursor:pointer;
    color: #909399;
  }
  .box-card-right{
    position: absolute;
    right:-310px;
    top:0px;
    width:300px;
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
</style>
