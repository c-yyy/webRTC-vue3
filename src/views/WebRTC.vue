<template>
  <div class="video-page">
    <video class="localVideo" />
    <video class="remoteVideo" ref="remoteVideo" />
    
    <section class="phone-section">
      <PhoneIcon />
    </section>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import PhoneIcon from '@/components/PhoneIcon.vue'
import { webRTC_mediaStreamQuery } from '@/config/webRTC'

export default defineComponent({
  components: {
    PhoneIcon
  },
  setup() {
    let localVideo = ref(null)
    const getLocalVideo = async () => {
      try {
        const localMediaStream = await navigator.mediaDevices.getUserMedia(webRTC_mediaStreamQuery)
        localVideo.value.srcObject = localMediaStream
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(() => {
      getLocalVideo()
    })
    return {
      localVideo,
    }
  },
})
</script>

<style lang="less" scoped>
.video-page {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.localVideo, .remoteVideo {
  background: #303133;
}
.localVideo {
  width: 100%;
  height: 100%;
}
.remoteVideo {
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 30vh;
  background: #fff;
  z-index: 3;
}
.phone-section {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-80%, -50%);
  z-index: 5;
  color: #fff;
}
</style>
