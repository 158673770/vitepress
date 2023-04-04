<script setup>
import {contentData} from "@/utils/api/journalism"
import { ref } from 'vue'
// defineProps({
  
// });
// 返回按钮
const router = useRouter();
const route = useRoute();
const contId = ref(route.query.id);
const contData = ref();
const show = ref(false);
const onClickLeft = (e) => {
    console.log("eee",router)
    router.go(-1)
};

const getData = async (contId) =>{
  let res = await contentData(contId);
  if(res != ''){
    let boxjsonp = JSON.parse(res.slice(12,-2));
    contData.value = boxjsonp.data;
    // const jsonpReturn = (e) => {
    //   contData.value = e.data;
    // };
    // eval(res);
    console.log("res新闻信息",contData.value)
    show.value = true
  }
}
onMounted(() =>{
    getData(contId.value);
})
// 

</script>

<template>
 <div class="box" v-if="show">
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
      style="background:#eee;"
    />
    <div class="particulars">
      <h3>
        {{ contData.title }}
        <!-- 鹤壁市农业农村局组织调研数字乡村建设 -->
      </h3>
      <div class="particulars_date">
        <p>
          来  源:{{ contData.description}}
        </p>
        <p>
          发布时间: {{ contData.t }}
        </p>
      </div>
      <div class="particulars_ctn" v-html="`${contData.content}`">
      </div>
    </div>
 </div>
</template>

<style lang="less" scoped>
  *{
      padding: 0;
      margin: 0;
      list-style: none;
  }
  /deep/  .van-nav-bar .van-icon {
    color: #000;
  }
  .box{
    .particulars{
      padding: 1rem 2%;
      .particulars_date{
        padding: 0.2rem 0;
        p{
          padding: 0.3rem 0;
          color: rgb(153, 153, 153);
        }
      }
    }
  }
</style>
