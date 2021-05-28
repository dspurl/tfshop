<template>
  <section class="vueVideo">
    <div
      v-video-player:myVideoPlayer="playerOptions"
      class="video-player vjs-custom-skin"
      :playsinline="playsinline"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @ready="playerReadied"
      @statechanged="playerStateChanged($event)"
    ></div>
  </section>
</template>

<style lang='scss' scoped>
  @import "./scss/VueVideo";
</style>

<script>
import js from './js/VueVideo'
export default js
</script>
