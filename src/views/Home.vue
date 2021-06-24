<template>
  <div class="main">
    <!-- <van-button type="primary" block >视讯路由跳转</van-button> -->
    <article>
      <img src="../assets/lawyer.png" alt="lawyer" @click="pushWebRTCPage" >
      <section>
        <img src="../assets/advisory.png" alt="advisory" >
        <img src="../assets/answer.png" alt="answer" >
        <img src="../assets/law.png" alt="law" >
      </section>
    </article>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Button } from 'vant';
import router from '@/router'

export default defineComponent({
  components: {
    [Button.name]: Button
  },
  setup() {
    const pushWebRTCPage = () => {
      router.push('/webRTC')
    }

    return {
      pushWebRTCPage
    }
  },
})
</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/bg-img.png');
  display: flex;
  justify-content: center;
  align-items: center;
}
article {
  display: flex;
  justify-content: center;
  align-items: center;
}
section {
  height: 424px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
}
</style>