<script setup>
import { ref } from 'vue'
import { slaplists } from "@/utils/api/report";
// 路由
const router = useRouter();
const route = useRoute();
const dataList = ref([])
// 返回按钮
const onClickLeft =() =>{
    router.go(-1)
}
const slaplistData =async () =>{
    let res = await slaplists();
    if( res.status == "1"){
        dataList.value = res.list
    }
    console.log("res",res)
}
// 页面初始化
onMounted(() => {
    slaplistData();
});
</script>

<template>
 <div class="box">
    <van-nav-bar
      title="上报记录"
      left-arrow
      @click-left="onClickLeft"
    />
    <div>
        <van-cell v-for="(item,index) in dataList" center :title="item.title" :label="item.create_time" is-link :key="index" >
            <template #value>
                <span class="custom-title" :style="{'color':item.status == '1' ? '#05ff0c' : '#000'}">{{ item.status == '1' ? '已处理' : '未处理' }}</span>
            </template>
        </van-cell>
    </div>
 </div>
</template>

<style lang="less" scoped>
  :deep( .van-nav-bar .van-icon){
    color: #000;
  }
</style>
