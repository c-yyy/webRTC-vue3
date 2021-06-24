<template>
  <div class="main">
    <article>
      <img src="../assets/lawyer.png" alt="lawyer" @click="pushWebRTCPage" />
      <section>
        <img src="../assets/advisory.png" alt="advisory" />
        <img src="../assets/answer.png" alt="answer" />
        <img src="../assets/law.png" alt="law" />
      </section>
    </article>
    <div @click="pushWebRTCPageTest">test</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// import { Button } from 'vant';
import router from '@/router'

export default defineComponent({
  components: {
    // [Button.name]: Button
  },
  setup () {
    const pushWebRTCPage = () => {
      router.push('/webRTC')
    }

    const pushWebRTCPageTest = () => {
      router.push('/webRTC?type=test')
    }

    return {
      pushWebRTCPage,
      pushWebRTCPageTest
    }
  }
})
</script>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/bg-img.png');
  background-size: cover;
  background-repeat: no-repeat;
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