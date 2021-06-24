<template>
  <div class="main">
    <img src="../assets/phone.png" >
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PhoneIcon',
  setup: () => {
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
img {
  width: 60%;
  height: 60%;
}
</style>
