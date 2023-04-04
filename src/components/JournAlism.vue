<script setup>
import { ref } from 'vue'
// 路由
const router = useRouter();
const route = useRoute();
// 返回按钮
const onClickLeft =() =>{
  router.go(-1)
}

</script>

<template>
 <div class="box">
    <van-nav-bar
      title="标题"
      left-arrow
      @click-left="onClickLeft"
    />
 </div>
</template>

<style lang="less" scoped>
 :deep( .van-nav-bar .van-icon){
    color: #000;
  }
</style>
