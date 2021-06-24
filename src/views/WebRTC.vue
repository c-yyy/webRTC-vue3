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
import { ref, defineComponent, onMounted, onUnmounted } from 'vue'
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
    const socket = io(socket_config.url, socket_config.config)
    console.log('RTCPeerConnection', connection)

    const closeVideo = () => {
      localMediaStream.getTracks().map(track => track.stop())
      localMediaStream = null
      connection.close()
      socket.emit('leave')
      socket.close()
    }

    const getLocalVideo = async () => {
      try {
        localMediaStream = await navigator.mediaDevices.getUserMedia(webRTC_mediaStreamQuery)
        localVideo.value.srcObject = localMediaStream
        console.log(localMediaStream)

        connection.addStream(localMediaStream)
        connection.onaddstream = e => {
          console.log('onaddstream', e)
        }
        connection.onicecandidate = e => {
          console.log('onicecandidate', e)
          if (e.candidate) {
            socket.emit('message', {
              type: 'candidate',
              candidate: e.candidate
            })
          }
        }
        connection.createOffer().then(offer => {
          console.log('offer', offer)
          connection.setLocalDescription(offer)
          socket.emit('message', {
            type: 'offer',
            offer
          })
        })
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
            closeVideo()
        }
      })
    }

    onMounted(() => {
      getLocalVideo()
      getRemoteVide()
    })

    onUnmounted(() => {
      closeVideo()
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
