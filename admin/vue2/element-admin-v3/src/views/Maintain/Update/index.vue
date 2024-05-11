<template>
  <div>
    <el-card :header="$t('update.title')" shadow="hover" class="card">
      <div class="tip" style="background-color: #fff6f7;border-left: 5px solid #fe6c6f;">
        <p>{{ $t('update.tip.one') }}</p>
        <p>{{ $t('update.tip.two') }}</p>
        <p>{{ $t('update.tip.three') }}</p>
        <p>{{ $t('update.tip.four') }}</p>
      </div>
      <div style="text-align: center;">
        <img src="@/assets/ver.svg" style="height:140px">
        <h2 style="margin-top: 15px;">TFSHOP</h2>
        <div v-loading="loading">
          <p style="margin-top: 5px;">{{ $t('update.current_version') }}：{{ data.version }}</p>
          <p style="margin-top: 5px;">{{ $t('update.latest_version') }}：{{ data.new_version }}</p>
          <template v-if="data.state === 1">
            <p style="margin-top: 5px;">
              <el-button type="primary" plain round @click="openBody">{{ $t('update.update_log') }}</el-button>
            </p>
            <p style="margin-top: 5px;">
              <el-button :loading="formLoading" round type="primary" @click="handleEdit(0)">{{ $t('update.updates') }}</el-button>
            </p>
            <pre v-if="is_pre" ref="main" class="pre" v-html="pre"/>
          </template>
          <template v-else>
            <el-button :loading="formLoading" round type="success" @click="getDetail">{{ $t('update.detection_update') }}</el-button>
          </template>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.card{
  margin: 20px;
}
.pre{
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-x: auto;
  background: #272822;
  color: #f8f8f2;
  text-align: left;
  padding:10px;
  height: 300px;
  width: 600px;
  margin: 0 auto;
  line-height: 30px;
  code{
    text-align: left;
  }
  .installation{
    position: relative;
    color: #cf7e11;
    line-height: 30px;
    .spinner {
      width: 150px;
      text-align: left;
      position: absolute;
      top:0;
      left: 40px;
    }

    .spinner > div {
      width: 6px;
      height: 6px;
      background-color: #cf7e11;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
      animation: bouncedelay 1.4s infinite ease-in-out;
      /* Prevent first frame from flickering when animation starts */
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }

    .spinner .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }

    .spinner .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }

    @-webkit-keyframes bouncedelay {
      0%, 80%, 100% { -webkit-transform: scale(0.0) }
      40% { -webkit-transform: scale(1.0) }
    }

    @keyframes bouncedelay {
      0%, 80%, 100% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
      } 40% {
          transform: scale(1.0);
          -webkit-transform: scale(1.0);
        }
    }
  }
}
</style>
<script>
import { detail, edit } from '@/api/update'
export default {
  name: 'Update',
  data() {
    return {
      loading: true,
      formLoading: false,
      is_pre: false,
      pre: '',
      data: {
        state: 0,
        version: '',
        new_version: '',
        body: '',
        zip: ''
      }
    }
  },
  created() {
    this.getInfo()
    // this.getDetail()
  },
  methods: {
    getInfo() {
      if (sessionStorage.getItem('update_info')) {
        this.data = JSON.parse(sessionStorage.getItem('update_info'))
      }
      this.loading = false
    },
    getDetail() {
      this.formLoading = true
      detail().then(response => {
        if (response.data.state === 2) {
          this.$message.error(this.$t('update.error.state.2'))
          this.formLoading = false
          console.log(response.data.body)
          return false
        } else if (response.data.state === 3) {
          this.$message.error(this.$t('update.error.state.3'))
          this.formLoading = false
          console.log(response.data.body)
          return false
        }
        this.data = response.data
        sessionStorage.setItem('update_info', JSON.stringify(response.data))
        this.formLoading = false
      })
    },
    openBody() {
      this.$alert(`<div style="white-space: pre-wrap;">${this.data.body}</div>`, this.$t('update.update_log'), {
        dangerouslyUseHTMLString: true
      }).then(() => { }).catch(() => { })
    },
    handleEdit(step) { // 更新
      if (step === 0) {
        this.formLoading = true
        this.is_pre = true
      }
      edit(step, this.data).then(response => {
        const div = this.$refs.main
        this.pre += response.data.message
        div.scrollTop = div.scrollHeight
        if (response.data.state === 2) {
          this.$alert(this.$t('hint.succeed.win', { attribute: this.$t('common.update') }), this.$t('common.succeed'), {
            confirmButtonText: this.$t('common.confirm'),
            callback: () => {
              this.pre = ''
              this.getDetail()
              this.formLoading = false
              this.is_pre = false
            }
          })
        } else if (response.data.state === 3) {
          this.formLoading = false
        } else {
          this.handleEdit(response.data.step)
        }
      }).catch(() => {
        this.formLoading = false
      })
    }
  }
}
</script>
