<template>
  <div class="video-page">
    <video class="localVideo" autoplay ref="localVideo" muted />
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
  setup () {
    let localVideo = ref(null)
    let remoteVideo = ref(null)
    let localMediaStream = null
    const connection = new RTCPeerConnection(webRTC_configuration)
    // eslint-disable-next-line no-undef
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

        /** Track 方式 */
        localMediaStream.getTracks().forEach(track => connection.addTrack(track, localMediaStream))
        connection.ontrack = (e) => {
          console.log('ontrack', e)
          if (remoteVideo.value.srcObject !== e.streams[0]) {
            remoteVideo.value.srcObject = e.streams[0]
          }
        }

        /** Stream 方式 */
        // connection.addStream(localMediaStream)
        // connection.onaddstream = e => {
        //   console.log('onaddstream', e)
        //   if (remoteVideo.srcObject !== e.streams[0]) {
        //     remoteVideo.value.srcObject = e.streams[0]
        //   }
        // }

        connection.onicecandidate = e => {
          console.log('onicecandidate', e)
          if (e.candidate) {
            socket.emit('message', {
              type: 'candidate',
              from: window.location.href.includes('type=test'),
              candidate: e.candidate
            })
          }
        }

        if (!window.location.href.includes('type=test')) {
          connection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          }).then(offer => {
            console.log('offer', offer)
            connection.setLocalDescription(offer)
            socket.emit('message', {
              type: 'offer',
              offer
            })
          })
        }
      } catch (error) {
        console.error(error)
      }
    }

    const getRemoteVide = () => {
      socket.on('message', async data => {
        const { type } = data
        switch (type) {
          case 'offer':
            if (window.location.href.includes('type=test')) {
              await connection.setRemoteDescription(new RTCSessionDescription(data.offer))
              connection.createAnswer().then(answer => {
                console.log('answer', answer)
                connection.setLocalDescription(answer)
                socket.emit('message', {
                  type: 'answer',
                  answer
                })
              })
              break;
            }
            return
          case 'answer':
            if (!window.location.href.includes('type=test') && data.answer) {
              connection.setRemoteDescription(new RTCSessionDescription(data.answer))
            }
            break;
          case 'candidate':
            if (connection && data.candidate && data.from !== window.location.href.includes('type=test')) {
              connection.addIceCandidate(new RTCIceCandidate(data.candidate))
            }
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
      remoteVideo
    }
  },
})
</script>

<style scoped>
.video-page {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.localVideo,
.remoteVideo {
  background: #303133;
}
.localVideo {
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  height: 30vh;
  background: #fff;
  z-index: 3;
}
.remoteVideo {
  width: 100%;
  height: 100%;
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
