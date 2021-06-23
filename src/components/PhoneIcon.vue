<template>
  <div class="main" @click="router.push('/home')">
    <img src="../assets/phone.png" >
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import router from '@/router'

export default defineComponent({
  name: 'PhoneIcon',
  setup: () => {
    return {
      router
    }
  }
})
</script>

<style lang="less" scoped>
.main {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  img {
    width: 60%;
    height: 60%;
  }
}
</style>
