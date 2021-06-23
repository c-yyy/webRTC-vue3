<template>
  <div class="video-page">
    <video class="localVideo" autoplay ref="localVideo" />
    <video class="remoteVideo" autoplay ref="remoteVideo" />
    
    <section class="phone-section">
      <PhoneIcon />
    </section>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import PhoneIcon from '@/components/PhoneIcon.vue'
import { webRTC_mediaStreamQuery, webRTC_configuration, socket_config } from '@/config/webRTC'

export default defineComponent({
  components: {
    PhoneIcon
  },
  setup() {
    let localVideo = ref(null)
    let localMediaStream = null
    const connection = new RTCPeerConnection(webRTC_configuration)
    console.log(io, 'socket')
    const socket = io(socket_config.url, socket_config.config)

    const getLocalVideo = async () => {
      try {
        localMediaStream = await navigator.mediaDevices.getUserMedia(webRTC_mediaStreamQuery)
        localVideo.value.srcObject = localMediaStream

        connection.addStream(localMediaStream)
        connection.onaddstream = e => {
          console.log('onaddstream', e)
        }
        connection.onicecandidate = e => {
          console.log('onicecandidate', e)
        }
        connection.createOffer().then(offer => {
          connection.setLocalDescription(offer)
          console.log('offer', offer)
        })
        console.log(localVideo)
      } catch (error) {
        console.error(error)
      }
    }

    const getRemoteVide = () => {
      socket.on('message', data => {
        const { type } = data
        switch (type) {
          case 'answer':
            connection.setRemoteDescription(new RTCSessionDescription(data.answer))
            break;
          case 'candidate':
            connection.addIceCandidate(new RTCIceCandidate(data.candidate))
            break;
          case 'close':
            localMediaStream.getTracks().map(track => track.stop())
            localMediaStream = null
            connection.close()
            socket.emit('leave')
        }
      })
    }

    onMounted(() => {
      getLocalVideo()
      getRemoteVide()
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
