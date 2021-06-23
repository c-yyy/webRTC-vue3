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
