import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
export default {
  props: {
    poster: {
      type: String,
      default: '',
    },
    sources: {
      type: String,
      default: '',
    },
    aspectRatio: {
      type: String,
      default: '4:4',
    },
  },
  data() {
    return {
      playsinline: true,
      playerOptions: {
        // 播放器配置
        muted: false, // 是否静音
        language: 'zh-CN',
        aspectRatio: this.aspectRatio,
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        controls: true,
        preload: 'auto', // 视频预加载
        fluid: true,
        sources: [
          {
            type: 'video/mp4',
            src: this.sources
          }
        ],
        poster: this.poster, // 封面图
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    // 监听播放
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    // 监听暂停
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // 监听停止
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    // 监听加载完成
    onPlayerLoadeddata(player) {
      // console.log('player Loadeddata!', player)
    },
    // 监听视频缓存等待
    onPlayerWaiting(player) {
      // console.log('player Waiting!', player)
    },
    // 监听视频暂停后播放
    onPlayerPlaying(player) {
      // console.log('player Playing!', player)
    },
    // 监听视频播放时长更新
    onPlayerTimeupdate(player) {
      // console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay(player) {
      console.log('player Canplay!', player)
    },
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },
    // 监听状态改变
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // 监听播放器准备就绪
    playerReadied(player) {
      // console.log('example 01: the player is readied', player)
    }
  }
}
