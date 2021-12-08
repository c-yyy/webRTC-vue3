<template>
  <div class="video-page">
    <video class="localVideo" autoplay ref="localVideo" muted />
    <video class="remoteVideo" autoplay ref="remoteVideo" />
    <audio
      src="https://qiniu.terminal.laway.cn/wait.mp3"
      loop
      ref="waitAudio"
    />
    <audio
      src="https://qiniu.terminal.laway.cn/video-ring.mp3"
      loop
      ref="videoAudio"
    />
    <section class="phone-section">
      <PhoneIcon @update:closeVideo="hangup" />
      <span>{{ callTime }}</span>
    </section>

    <section class="ping-fps" @click="showLog = !showLog">
      <!-- <span v-show="FPS !== undefined">fps {{ FPS }}</span> -->
      <p v-show="showLog" style="width: 30vw">{{ Logs }}</p>
    </section>
  </div>

  <Calling
    v-if="callTime === '00:00:00'"
    @update:clearLawyerList="clearLawyerList"
    @hangup="hangup"
  />
</template>

<script>
import { ref, defineComponent, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import PhoneIcon from '@/components/PhoneIcon.vue'
import Calling from '@/components/Calling.vue'
import axios from 'axios'
import { Dialog } from 'vant';
import { useRoute, useRouter } from 'vue-router';
// import router from '@/router'
// import { webRTC_mediaStreamQuery, webRTC_configuration, socket_config } from '@/config/webRTC'

export default defineComponent({
  components: {
    PhoneIcon,
    Calling
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    let localVideo = ref(null)
    let remoteVideo = ref(null)
    let waitAudio = ref(null)
    let videoAudio = ref(null)
    let showLog = ref(false)
    let Logs = ref('log')
    // let RTT = ref('')
    let FPS = ref('')
    // let curLawyer = null
    // let lawyerIdx = 0
    let Timer = null
    let callTime = ref('00:00:00')
    const alert = ref({
      show: false,
      info: '',
      recall: () => { }
    })
    const people = ref(route.query.people || '律师')
    // const isLawyer = window.location.href.includes('lawyer')
    // const lawyerId = window.location.href.split('?lawyer=')[1]
    // eslint-disable-next-line no-unused-vars
    let localMediaStream, remoteMediaStream = null
    // const connection = new RTCPeerConnection(webRTC_configuration)
    // eslint-disable-next-line no-undef
    // const socket = io(socket_config.url, socket_config.config)

    // const closeVideo = () => {
    //   localMediaStream && localMediaStream.getTracks().map(track => track.stop())
    //   localMediaStream = null
    //   remoteMediaStream = null
    //   clearInterval(Timer)
    //   connection.close()
    //   socket.emit('leave', lawyerId || curLawyer && curLawyer.uuid || '')
    //   socket.close()
    // }

    const clearLawyerList = () => {
      // socket.emit('clearLawyerList')
    }

    // socket.on('reset', () => {
    //   if (isLawyer) {
    //     window.location.reload()
    //   }
    // })

    const formateTime = (time) => {
      if (time < 60) {
        return `00:00:${time < 10 ? '0' + time : time}`;
      } else if (time > 60 && time < 3600) {
        const min = parseInt(time / 60);
        const sed = time % 60;
        return `00:${min < 10 ? '0' + min : min}:${sed < 10 ? '0' + sed : sed}`;
      } else if (time > 3600) {
        const h = parseInt(time / 3600);
        const min = parseInt((time % 3600) / 60);
        const sed = (time % 3600) % 60;
        return `${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min}:${sed < 10 ? '0' + sed : sed
          }`;
      }
    }

    const startTiming = () => {
      let time = 0;

      Timer = setInterval(async () => {
        time += 1;
        callTime.value = formateTime(time);
        // const stats = await connection.getStats(null)
        // stats.forEach(report => {
        //   if (report.type === "inbound-rtp" && report.kind === "video") {
        //     Logs.value = report
        //     // if (report.totalRoundTripTime && report.responsesReceived) {
        //     //   RTT.value = parseInt((report.totalRoundTripTime / report.responsesReceived) * 1000)
        //     // }
        //     FPS.value = report.framesPerSecond
        //   }
        // })
      }, 1e3);
    }

    // const lawyerSearch = () => {
    //   socket.emit('wantLawyerList')
    //   socket.on('lawyerList', async data => {
    //     if (!data.length && remoteMediaStream === null) {
    //       !isLawyer && Dialog.confirm({
    //         title: '通话中断',
    //         message: '所有律师占线中～',
    //       }).then(() => {
    //         // on close
    //         if (isLawyer) {
    //           window.location.reload()
    //         } else {
    //           router.replace('/home')
    //         }
    //       });
    //       return
    //     }

    //     // 轮询拨打律师
    //     if (lawyerIdx <= data.length - 1 && remoteMediaStream === null) {
    //       curLawyer = {
    //         nickname: data[lawyerIdx].lawyer,
    //         uuid: data[lawyerIdx].uuid
    //       }
    //       console.log('可以拨打', curLawyer)
    //       // 加入房间
    //       socket.emit('join', data[lawyerIdx].uuid)
    //       socket.emit('message', data[lawyerIdx].uuid, {
    //         type: 'call',
    //         from: 'xiaodu',
    //         lawyer: data[lawyerIdx].lawyer,
    //         to: data[lawyerIdx].uuid
    //       })
    //     }
    //   })
    // }

    // const getLocalVideo = async () => {
    //   try {
    //     document.querySelector('.localVideo').setAttribute('autoplay', '');
    //     document.querySelector('.localVideo').setAttribute('muted', '');
    //     document.querySelector('.localVideo').setAttribute('playsinline', '');
    //     document.querySelector('.remoteVideo').setAttribute('autoplay', '');
    //     document.querySelector('.remoteVideo').setAttribute('muted', '');
    //     document.querySelector('.remoteVideo').setAttribute('playsinline', '');
    //     localMediaStream = await navigator.mediaDevices.getUserMedia(webRTC_mediaStreamQuery)
    //     localVideo.value.srcObject = localMediaStream

    //     if (isLawyer) {
    //       // 加入房间
    //       socket.emit('join', lawyerId)
    //       socket.emit('setStatus', {
    //         status: 'free',
    //         lawyer: `律师-${lawyerId}`,
    //         uuid: lawyerId
    //       })
    //     } else {
    //       waitAudio.value.play()
    //       lawyerSearch()
    //       connection.onicecandidate = e => {
    //         if (e.candidate) {
    //           socket.emit('message', curLawyer.uuid, {
    //             type: 'candidate',
    //             from: 'xiaodu',
    //             candidate: e.candidate,
    //             lawyer: curLawyer.nickname,
    //             to: curLawyer.uuid
    //           })
    //         }
    //       }
    //     }

    //     socket.on('leaved', () => {
    //       if (remoteMediaStream !== null) {
    //         Dialog.confirm({
    //           title: '通话结束',
    //           message: '对方已挂断～',
    //         }).then(() => {
    //           // on close
    //           if (isLawyer) {
    //             window.location.reload()
    //           } else {
    //             router.replace('/home')
    //           }
    //         });
    //       } else {
    //         !isLawyer && Dialog.confirm({
    //           title: '提示',
    //           message: '对方未接听～',
    //         }).then(() => {
    //           // on close
    //           if (isLawyer) {
    //             window.location.reload()
    //           } else {
    //             router.replace('/home')
    //           }
    //         });
    //       }
    //     })

    //     /** Track 方式 */
    //     localMediaStream && localMediaStream.getTracks().forEach(track => connection.addTrack(track, localMediaStream))
    //     connection.ontrack = (e) => {
    //       if (remoteVideo.value.srcObject !== e.streams[0]) {
    //         waitAudio.value.pause()

    //         remoteMediaStream = e.streams[0]
    //         remoteVideo.value.srcObject = e.streams[0]

    //         startTiming()
    //       }
    //     }
    //   } catch (error) {
    //     Dialog.confirm({
    //       title: '提示',
    //       message: '请打开授权～',
    //     }).then(() => {
    //       // on close
    //       if (isLawyer) {
    //         window.location.reload()
    //       } else {
    //         router.replace('/home')
    //       }
    //     });
    //   }
    // }

    // const getRemoteVide = () => {
    //   socket.on('message', async (room, data) => {
    //     const { type } = data
    //     switch (type) {
    //       case 'call':
    //         if (isLawyer) {
    //           videoAudio.value.play()
    //           socket.emit('setStatus', {
    //             status: 'busy',
    //             lawyer: `律师-${lawyerId}`,
    //             uuid: lawyerId
    //           })
    //           Dialog.confirm({
    //             title: '提示',
    //             confirmButtonText: '接听',
    //             message: '视频咨询，是否接听？',
    //           })
    //             .then(async () => {
    //               // on confirm
    //               videoAudio.value.pause()
    //               await connection.createOffer({
    //                 offerToReceiveAudio: true,
    //                 offerToReceiveVideo: true
    //               }).then(offer => {
    //                 connection.setLocalDescription(offer)
    //                 socket.emit('message', lawyerId, {
    //                   type: 'offer',
    //                   from: 'xiaodu',
    //                   offer,
    //                   lawyer: `律师-${lawyerId}`,
    //                   to: lawyerId
    //                 })
    //               })
    //             })
    //             .catch(() => {
    //               // on cancel
    //               socket.emit('leave', lawyerId || curLawyer && curLawyer.uuid || '')
    //               window.location.reload()
    //             })
    //         }
    //         break;
    //       case 'offer':
    //         if (!isLawyer && data.offer) {
    //           await connection.setRemoteDescription(new RTCSessionDescription(data.offer))
    //           connection.createAnswer().then(answer => {
    //             connection.setLocalDescription(answer)
    //             socket.emit('message', curLawyer.uuid, {
    //               type: 'answer',
    //               from: 'xiaodu',
    //               answer,
    //               lawyer: curLawyer.nickname,
    //               to: curLawyer.uuid
    //             })
    //           })
    //           break;
    //         }
    //         return
    //       case 'answer':
    //         if (isLawyer && data.answer) {
    //           await connection.setRemoteDescription(new RTCSessionDescription(data.answer))
    //         }
    //         break;
    //       case 'candidate':
    //         if (connection && data.candidate) {
    //           await connection.addIceCandidate(new RTCIceCandidate(data.candidate))
    //         }
    //         break;
    //       case 'close':
    //         closeVideo()
    //     }
    //   })
    // }

    const initDataChannel = function () {
      {
        window.easyrtc.setPeerListener(async (who, msgType, content) => {
          console.log(who, msgType, content, '2setPeerListener')
          if (
            msgType === 'link' &&
            this.step !== 3 &&
            !this.recordGUID &&
            !this.userGUID
          ) {
            this.userGUID = content
            this.$requestService
              .post('/api/record/start', {
                userGUID: content, // 律师GUID
                customerID: this.userIdCard // 用户身份证号
              })
              .then(res => {
                console.log(res.data.result.recordGUID)
                this.recordGUID = res.data.result.recordGUID
                window.easyrtc.sendDataWS(who, 'link', {
                  recordGUID: this.recordGUID,
                  userIdCard: this.userIdCard,
                  code: window.localStorage.code
                })
              })
              .catch(err => {
                console.log('recordstart失败')
                console.log(err)
              })
          }

          // 打印pdf
          if (msgType === 'print') {
            const res = JSON.parse(content)
            const printA4Name = window.localStorage.getItem('printA4Name')
            this.$electron.ipcRenderer.send('printRemoteFile', res.fileurl, printA4Name)
          }
        })
      }
    }

    const hangup = function () {
      console.log('hangup')
      waitAudio.value && waitAudio.value.pause()
      // window.easyrtc.hangupAll()
      if (window.RTCTmpId) {
        try {
          axios.post("https://api.terminal.wulvshi.com/api-v2/record-v3/end", {
            id: window.RTCTmpId,
          }).then(res => {
            if (res.data) {
              console.log(res.data)
            } else {
              console.log('创建咨询结束记录失败')
            }
          }).catch(err => {
            console.log("登记咨询结束记录失败");
            console.log(err);
          })
        } catch (err) {
          console.log(err)
        }
      }
      proxy.$rtc.reset()
      proxy.$rtc.hangUp()
      console.log(proxy.$rtc)
      router.replace('/')
    }

    const call = async function (cid = 0) {
      waitAudio.value.play()
      // 获取本地视频流
      const localStream = proxy.$rtc.getLocalStream()
      if (localStream) {
        console.log('拿到了')
        // 将本地视频流加载到dom
        const targetVideo = proxy.$refs.localVideo
        targetVideo.muted = true
        targetVideo.srcObject = localStream
        if (!targetVideo) {
          console.log('268', targetVideo)
        }
      } else {
        console.log('拿不到')
      }
      // 获取可以呼叫的律师
      let {
        data: { result: lawyers }
      } = await axios.get(
        'https://api.terminal.wulvshi.com/api-v2/channel/listLawyers',
        {
          params: {
            cid,
            code: window.localStorage.getItem('code')
          }
        }
      )
      console.log('lawyers:', lawyers)
      if (lawyers.length === 0) {
        alert.value.info = `当前暂无${people.value}在线，请稍后再来`
        Dialog({
          message: `当前暂无${people.value}在线，请稍后再来`,
        }).then(() => {
          router.replace('/')
        })
        // proxy.$alert(`当前暂无${people.value}在线，请稍后再来`)
        //  proxy.$stopSpeak()
        // setTimeout(() => {
        //   proxy.$router.go(-1)
        // }, 5000)
      } else {
        // 去重
        lawyers = [...new Set((lawyers || []).map(item => item.userGUID))]
        // 视频接通事件
        proxy.$rtc.onStreamAccept(({ targetId, selfStream, targetStream }) => {
          console.log('通话接通， onStreamAccept')
          startTiming()
          proxy.nowEasyrtcid = targetId
          proxy.step = 2
          setTimeout(async () => {
            if (proxy.$refs.localVideo) {
              const selfVideo = proxy.$refs.localVideo;
              const targetVideo = proxy.$refs.remoteVideo;
              // const outAudioSetting = JSON.parse(window.localStorage.outAudioSetting)
              const audioOutputDevice = proxy.$rtc.getAudioOutputDevice();
              selfVideo.srcObject = selfStream;
              // 远程摄像头
              targetVideo.srcObject = targetStream;
              targetVideo.muted = false;
              // 远程语音信息
              console.log('语音输出加载到：' + audioOutputDevice)
              try {
                if (audioOutputDevice !== 'default') {
                  await proxy.$jsMediaDevices.setOutAudioDevices(
                    targetVideo,
                    // outAudioSetting['microphone'].deviceId
                    audioOutputDevice
                  );
                }
              } catch (err) {
                console.log('语音输出加载异常：')
                console.log(err)
              }

              // 开启数据传输频道
              // initDataChannel();
            }
          })
        })
        // 本地视频流加载成功
        proxy.$rtc.onLoadLocalStream(stream => {
          // 接通之前先显示自己
          const targetVideo = proxy.$refs.localVideo
          if (targetVideo) {
            console.log('targetVideo:', targetVideo)
            targetVideo.muted = true
            targetVideo.srcObject = stream
          }
        })

        // 呼叫计时
        proxy.callTimer = setTimeout(() => {
          alert.value.info = '暂时无人接听，请稍后再试'
          waitAudio.value && waitAudio.value.pause()
          Dialog({
            message: '暂时无人接听，请稍后再试'
          }).then(() => {
            router.replace('/')
          })
          proxy.$rtc.reset()
        }, 60 * 1000)
        try {
          // 传入呼叫的律师的uuid数组
          await proxy.$rtc.videoCall(lawyers)
          console.log('已接通，清空计时器')
          waitAudio.value && waitAudio.value.pause()
          clearTimeout(proxy.callTimer)
          proxy.$rtc.onEnd(() => {
            proxy.hangup()
          })
          //  proxy.$stopSpeak()
        } catch (e) {
          console.warn(e.code)
          if (e.code === 'NO_ANSWER' || e.code === 'NO_LAWYER') {
            if (e.code === 'NO_ANSWER') {
              waitAudio.value && waitAudio.value.pause()
              alert.value.info = '暂时无人接听，请稍后再试'
              Dialog({
                message: '暂时无人接听，请稍后再试'
              }).then(() => {
                router.replace('/')
              })
            }
            if (e.code === 'NO_LAWYER') {
              alert.value.info = `暂时没有${people.value}在线，请稍后再试`
              Dialog({
                message: `暂时没有${people.value}在线，请稍后再试`
              }).then(() => {
                router.replace('/')
              })
              // proxy.$alert(`暂时没有${people.value}在线，请稍后再试`)
              //  proxy.$stopSpeak()
            }
            clearTimeout(proxy.callTimer);
            proxy.$rtc.reset()
            // setTimeout(() => {
            //   clearTimeout(proxy.callTimer)
            //   proxy.$router.go(-1)
            // }, 3000)
          }
        }
      }
    }

    onMounted(() => {
      // getLocalVideo()
      // getRemoteVide()
      call()
    })

    onUnmounted(() => {
      // closeVideo()
      if (Timer) {
        clearInterval(Timer)
      }
    })

    return {
      localVideo,
      remoteVideo,
      clearLawyerList,
      waitAudio,
      videoAudio,
      callTime,
      showLog,
      Logs,
      // RTT,
      FPS,
      router,
      call,
      formateTime,
      hangup,
      initDataChannel
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
  transform: rotateY(180deg);
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
  width: 100%;
  position: fixed;
  bottom: 20%;
  z-index: 5;
  color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.ping-fps {
  color: #fff;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
}
</style>
