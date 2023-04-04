<script setup>
import { ref } from 'vue'
const router = useRouter();
const route = useRoute();
const onClickLeft = (e)=>{
    console.log("e",e)
    router.go(-1);
}
// 上报反馈
const gorePort = () =>{
    router.push({
        name:'reportmsg'
    })
}
// 上报记录
const infoRePort = () =>{
    router.push({
        name:'inforeport'
    })
    // inforeport
}

</script>

<template>
 <div class="box">
    <van-nav-bar
      title="上报"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="canten">
        <div class="canten_bg">
            <img src="../../assets/images/bg.png" alt="">
        </div>
        <div class="canten_btn">
            <van-button round color="rgb(253 69 69)" @click="gorePort">上报反馈</van-button>
            <van-button round color="rgb(253 69 69)" @click="infoRePort">上报记录</van-button>
        </div>
    </div>
 </div>
</template>

<style lang="less" scoped>
  :deep( .van-nav-bar .van-icon){
    color: #000;
  }
  .box{
    .canten_bg{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5rem 5% 3rem;
    }
    .canten_btn{
        display: flex;
        justify-content: space-between;
        padding: 0 3%;
        button{
            width: 45%;
        }
    }
  }
</style>
