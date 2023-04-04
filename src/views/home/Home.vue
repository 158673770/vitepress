<script setup>
import {
  journalismList,
  infosList,
  xzData,
  czData,
} from "@/utils/api/journalism";
import { ref, reactive } from "vue";
// 返回按钮
const router = useRouter();
// 新闻类型
const tapList = ref({});
// 弹窗显示隐藏
const show = ref(false);
// 选中的id
const indexId = ref();
// 新闻列表
const tapinfosList = ref({});
// 乡镇
let xzcolumns = ref([]);
const xzValue = ref("");
const xzPicker = ref(false);
const xzonConfirm = async (value) => {
  xzValue.value = value.selectedOptions[0];
  xzPicker.value = false;
  let res = await czData(value.selectedOptions[0].value);
  if(res != ''){
    czcolumns.value = res.data.map((item) => ({
      text: item.village_name,
      value: item.village_id,
    }));
    czValue.value = ""
  }
};
const xzclick = () => {
  xzPicker.value = true;
};
// 村庄
const czcolumns = ref([]);
const czValue = ref("");
const czPicker = ref(false);
const czclick = () => {
  czPicker.value = true;
};
const czonConfirm = async (value) => {
  czValue.value = value.selectedOptions[0];
  czPicker.value = false;
};
const qkxzclick = () =>{
  czValue.value = '';
  xzValue.value = '';
}
// 返回上一页
const onClickLeft = (e) => {
  console.log("eee", router);
  router.go(-1);
};
// 初始化tap数据
const getData = async () => {
  let list = await journalismList();
  console.log("list", list);
  if (list != "") {
    let boxjsonp = JSON.parse(list.slice(12, -2));
    tapList.value = boxjsonp.data;
    indexId.value = tapList.value[0];
    getinfosList(indexId.value);
  }
  let xzlist = await xzData();
  if (xzlist != "") {
    console.log("xzlist", xzlist);
    // let boxjsonp = JSON.parse(xzlist.slice(12,-2));
    xzcolumns.value = xzlist.data.map((item) => ({
      text: item.town_name,
      value: item.town_id,
    }));
    console.log("xzcolumns", xzcolumns);
  }
};
// 点击切换新闻
const getinfosList = async (item) => {
  show.value = false;
  indexId.value = item.id;
  console.log(item);

  let data = {
    pagesize: 100,
    sid: item.id,
    villageid: czValue.value.value ? czValue.value.value : 0,
  };

  let res = await infosList(data);
  if (res != "") {
    let boxjsonp = JSON.parse(res.slice(12, -2));
    tapinfosList.value = boxjsonp.data;
    // tapinfosList.value
    console.log("list", tapinfosList.value);
  }
};
// 点击显示弹出层
const showPopup = () => {
  show.value = true;
};
// 跳转详情页
const journalis = (index, item) => {
  console.log("e", item);
  console.log("e", index);
  router.push({
    name: "homelis",
    query: {
      id: item.aid,
    },
  });
};
// 关闭弹窗
const onClickOverlay = () => {
  show.value = false;
};
const onClickCloseIcon = () => {
  show.value = false;
};
const sspClick = () =>{
  window.location = 'ssp.140.161.alsite.veeteam.com';
}
onMounted(() => {
  getData();
});
</script>

<template>
  <div class="box">
    <van-nav-bar title="村务公开" left-arrow @click-left="onClickLeft" />
    <!-- 头部切换 -->
    <div class="flex">
      <div class="left">
        <div class="left_cant">
          <van-button
            v-for="(item, index) in tapList"
            :class="{ active: item.id == indexId }"
            size="mini"
            :key="index"
            @click="getinfosList(item)"
            >{{ item.name }}</van-button
          >
        </div>
      </div>
      <div class="right">
        <div class="right_icon" @click="showPopup">
          <span>检索</span>
          <van-icon name="apps-o" />
        </div>
        <van-popup
          :show="show"
          closeable
          position="bottom"
          :style="{ height: '100%' }"
          @click-overlay="onClickOverlay"
          @click-close-icon="onClickCloseIcon"
        >
          <van-nav-bar title="全部频道" />
          <!--乡镇  -->
          <div style="padding: 0.5rem 2%">
            <van-field
              v-model="xzValue.text"
              is-link
              readonly
              label="乡镇"
              placeholder="选择乡镇"
              @click="xzclick"
            >
            </van-field>
            <van-popup
              :show="xzPicker"
              round
              position="bottom"
              :style="{ height: '50%' }"
            >
              <van-picker
                :columns="xzcolumns"
                @cancel="xzPicker = false"
                @confirm="xzonConfirm"
              />
            </van-popup>
            <!-- 村庄 -->
            <van-field
              v-model="czValue.text"
              is-link
              readonly
              label="村庄"
              placeholder="选择乡镇"
              @click="czclick"
            >
            </van-field>
            <van-popup :show="czPicker" round position="bottom" :style="{ height: '50%' }" >
              <van-picker
                :columns="czcolumns"
                @cancel="czPicker = false"
                @confirm="czonConfirm"
              />
            </van-popup>
          </div>
          <van-button type="primary" block @click="qkxzclick">清空乡镇村庄选择</van-button>
          <ul class="right_list">
            <li
              v-for="(item, index) in tapList"
              :class="{ active: item.id == indexId }"
              size="mini"
              :key="index"
              @click="getinfosList(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </van-popup>
      </div>
    </div>
    <div class="ssp">
      <a href="http://ssp.140.161.alsite.veeteam.com">
        <van-button round size="small" icon="photo-o" type="success">随手拍</van-button>         
      </a>                                                                                                                                                                                                                   
    </div>
    <div class="cantent">
      <div v-if="tapinfosList.length == 0" style="text-align: center;">
        暂无更多数据
      </div>
      <ul class="cantent_box">
        <li
          v-for="(item, index) in tapinfosList"
          :key="index"
          @click="journalis(index, item)"
        >
          <div class="list_left">
            <img
              :src="
                'http://cwgk.140.161.alsite.veeteam.com/' + `${item.thumbnail}`
              "
              alt=""
            />
          </div>
          <div class="list_right">
            <h3>{{ item.title }}</h3>
            <p>
              {{ item.content }}
            </p>
            <b> {{ item.t }} </b>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  list-style: none;
}
/deep/ .van-nav-bar .van-icon {
  color: #000;
}
.box {
  .van-nav-bar__arrow {
    color: #000;
  }
  .ssp{
    padding: 1rem 3% 0;
    .van-button{
      padding: 0 0.5rem;
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    .left {
      width: 85%;
    }
    .left_cant {
      width: 100%;
      overflow: hidden;
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      justify-content: left;
      align-items: center;
      padding: 0 2%;
      .van-button {
        border: none;
        background-color: #f1f1f1;
        margin: 0 2%;
        padding: 0 2.5%;
        border-radius: 1rem;
      }
      .active {
        color: rgb(0, 132, 255);
      }
    }
    .left_cant::-webkit-scrollbar {
      display: none;
    }
    .right {
      margin-right: 1%;
      .right_icon {
        display: flex;
        justify-content: left;
        align-items: center;
        font-size: 0.8rem;
      }
      .right_list {
        display: flex;
        justify-content: left;
        padding: 1rem 2%;
        flex-wrap: wrap;
        li {
          width: 20%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin: 0.5rem 2.5% 0 0;
          text-align: center;
          padding: 0.3rem 1%;
          background-color: #f1f1f1;
          border-radius: 0.5rem;
        }
        li:nth-child(4n) {
          margin-right: 0;
        }
        .active {
          color: rgb(0, 132, 255);
        }
      }
    }
  }
  .cantent_box {
    li {
      display: flex;
      justify-content: space-between;
      padding: 1.5rem 3% 0;
      .list_left {
        width: 30%;
        height: 6.5rem;
        border-radius: 1rem;
        overflow: hidden;
        // background-color: #000;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .list_right {
        width: 65%;
        position: relative;
        h3 {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        p {
          overflow: hidden;
          -webkit-line-clamp: 2; // 超出多少行
          -webkit-box-orient: vertical;
          height: 2.8rem;
        }
        b {
          position: absolute;
          left: 0;
          bottom: 0;
          font-weight: 400;
          color: rgb(104, 104, 104);
        }
      }
    }
  }
}
</style>
