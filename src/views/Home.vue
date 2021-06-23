<template>
  <div>
    <van-button type="primary" block to="/webRTC">视讯路由跳转</van-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Button } from 'vant';

export default defineComponent({
  components: {
    [Button.name]: Button
  },
  setup() {
  },
})
</script>
