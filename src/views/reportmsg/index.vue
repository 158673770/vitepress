<script setup>
import { ref } from "vue";
import { slapList,addFile,addInfo } from "@/utils/api/report";
import AMapLoader from '@amap/amap-jsapi-loader' // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
import { shallowRef } from '@vue/reactivity'
import { nextTick, onMounted } from '@vue/runtime-core'
import { showNotify } from 'vant';
import 'vant/es/notify/style';
// 路由
const router = useRouter();
const route = useRoute();
// 标题
const name = ref("");
// 描述
const message = ref("");
const pattern = /\S/;
// 类型
const result = ref("");
// 类型数据
let columns = [];
// const map = shallowRef(null);
let AMapsplaceSearch = null;
// 地图弹出窗
const showTop = ref(false);
// 搜索框
const search = ref("");
// 列表数据
const selectList = ref([]);
// 选中数据
const indexcode = ref("")
// 位置输入框
const adcodewz = ref({});
// 文件上传
const fileList = ref([]);
const fileUrl = ref('')
// 获取类型接口数据
const getslapList = async () => {
  let res = await slapList();
  if (res.status == "1") {
    let reslist = res.data;
    console.log(reslist, "reslist");
    reslist.forEach((element) => {
      columns.push({
        text: element.name,
        value: element.id,
      });
    });
    console.log("columns", columns);
  }
};
// 弹窗显示隐藏
const showPicker = ref(false);
// 返回按钮
const onClickLeft = () => {
  router.go(-1);
};
// 提交表单
const onFailed = (errorInfo) => {
  console.log("failed", errorInfo);
  showNotify({ type: 'warning',  message:errorInfo.errors[0].message});
};
const onSubmit = async(errorInfo) =>{
  //  let  res = {
  //     title:errorInfo.pattern,
  //     content:errorInfo.message,
  //     pic:fileUrl.value,
  //     type:errorInfo.picker,
  //     address:adcodewz.name,
  //     city_id:'',
  //     countyid:'',
  //     townid:'',
  //     villageid:''
  //   }
    let res = await addInfo({
        title:errorInfo.pattern,
        content:errorInfo.message,
        pic:fileUrl.value,
        type:errorInfo.picker,
        address:adcodewz.value.name,
        // city_id:'',
        // countyid:'',
        // townid:'',
        // villageid:''
    });
    if(res.status == '1'){
      // 成功通知
      showNotify({ type: 'success', message: res.message });
      router.go(-1);
    }else{
      showNotify({ type: 'danger', message: res.message || '接口异常' });
      router.go(-1);
    }
    // console.log("failed", adcodewz.value.name);
}
// 上传文件
const afterRead = async(file) => {
  // 此时可以自行将文件上传至服务器
  
  const formData = new FormData();
  formData.append("file", file.file);
  let res = await addFile(formData);
  if(res.statusCode == 200){
    fileUrl.value = res.data
  }
  console.log(file,"res",res);

};
// 选中数据
const onConfirm = ({ selectedOptions }) => {
  result.value = selectedOptions[0]?.text;
  showPicker.value = false;
};
// 完成事件
const clickSuccess = () =>{
    showTop.value = false;
}
const clickplace = () => {
  showTop.value = true;
  getMap();
};
const getMap = () => {
    // console.log("AMapLoader",AMapLoader)
    AMapLoader.load({
        key: "9b067fa853b8ad284cad1ee87918cef9", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [
          "AMap.PlaceSearch", //工具条，控制地图的缩放、平移等
          "AMap.AutoComplete", //比例尺，显示当前地图中心的比例尺
          "AMap.Geolocation", //定位，提供了获取用户当前准确位置、所在城市的方法
        ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        
      }).then((AMap) => {
        let map = new AMap.Map("map", {//设置地图容器id
            resizeEnable: true,
            layers: [
                // 卫星
                new AMap.TileLayer.Satellite(),
                // 路网
                new AMap.TileLayer.RoadNet()
            ],
            zoom: 8, //初始化地图级别
            // center: [115.85812099999998, 28.683213], //初始化地图中心点位置
          });
      var options = {
          'showButton': true,//是否显示定位按钮
          'position': 'LB',//定位按钮的位置
          /* LT LB RT RB */
          'offset': [10, 240],//定位按钮距离对应角落的距离
          'showMarker': true,//是否显示定位点
          'markerOptions':{//自定义定位点样式，同Marker的Options
          'offset': new AMap.Pixel(-18, -36),
          'content':'<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
          },
          'showCircle': true,//是否显示定位精度圈
          'circleOptions': {//定位精度圈的样式
              'strokeColor': '#0093FF',
              'noSelect': true,
              'strokeOpacity': 0.5,
              'strokeWeight': 1,
              'fillColor': '#02B0FF',
              'fillOpacity': 0.25
          },
          "enableHighAccuracy":true
      }
      var geolocation = new AMap.Geolocation(options);
      map.addControl(geolocation);
      // geolocation.getCurrentPosition()
            //输入提示
			var autoOptions = {
				input: "tipinput"
			};
			var auto = new AMap.Autocomplete(autoOptions);
			AMapsplaceSearch = new AMap.PlaceSearch({
				map: map
			}); 
      //构造地点查询类
      auto.on("complete",function(e){
          console.log("e",e)
          selectList.value = e.tips
          console.log("selectList.value",selectList.value)
      })
			AMap.Event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
			AMap.Event.addListener(auto, "error", onError); //注册监听，当选中某条记录时会触发
      AMap.Event.addListener(geolocation, 'complete', onComplete)
      function onComplete (data) {
        console.log(data)

        // data是具体的定位信息
      }
			// //解析定位正确信息
			function select(e) {
				console.log(e)
				AMapsplaceSearch.setCity(e.poi.adcode);
				AMapsplaceSearch.search(e.poi.name); //关键字查询查询
				var info = e.poi;//地理信息
        console.log("定位坐标信息",info)
			}
			//解析定位错误信息
			function onError(data) {
				console.log("定位失败")
                console.log("data.info",data)
				// mui.alert(data.info)
			}

      }).catch((e) => {
            console.log(e);
      });
};
const selectbox =(e) => {
    console.log("e",e)
    // console.log("AMapsplaceSearch",AMapsplaceSearch)
    AMapsplaceSearch.setCity(e.adcode);
	AMapsplaceSearch.search(e.name); //关键字查询查询
    indexcode.value = e
    adcodewz.value = e
    console.log("indexcode",indexcode)
    // placeSearch.setCity(e.poi.adcode);
    // placeSearch.search(e.poi.name); //关键字查询查询
    // var info = e.poi;//地理信息
}
// 页面初始化
onMounted(() => {
  getslapList();
});
</script>

<template>
  <div class="box">
    <van-nav-bar title="发布" left-arrow @click-left="onClickLeft" />
    <div class="cantent">
      <van-form @submit="onSubmit" @failed="onFailed">
        <van-cell-group inset>
          <van-field
            required
            label-width="3rem"
            v-model="name"
            label="标题"
            name="pattern"
            placeholder="请填写标题"
            :rules="[{ pattern, message: '请填写标题' }]"
          />
          <!-- 描述 -->
          <van-field
            name="message"
            v-model="message"
            rows="2"
            autosize
            type="textarea"
            maxlength="500"
            placeholder="描述一下遇到的问题..."
            show-word-limit
          />
          <!-- 上传 -->
          <van-field name="uploader" :rules="[{ pattern, message: '请上传文件' }]">
            <template #input>
                <van-uploader name="fileList" v-model="fileList" multiple :max-count="1" :after-read="afterRead" />
            </template>
          </van-field>
          <!-- 类型 -->
          <van-field
            required
            label-width="4rem"
            v-model="result"
            is-link
            readonly
            name="picker"
            label="类型"
            placeholder="类型"
            @click="showPicker = true"
            input-align="right"
            :rules="[{ pattern, message: '请选择类型' }]"
          />
          <van-popup v-model:show="showPicker" position="bottom">
            <van-picker
              :columns="columns"
              @confirm="onConfirm"
              @cancel="showPicker = false"
            />
          </van-popup>
          <!-- 位置 -->
          <van-field required center name="adcodewz" :rules="[{ pattern, message: '请选择位置信息' }]" clearable label="选择位置" v-model="adcodewz.name">
            <template #button>
              <van-button size="small" type="success" @click="clickplace"
                >请选择位置</van-button
              >
            </template>
          </van-field>
          
            <div style="margin: 16px;">
                <van-button block type="primary" native-type="submit">
                    发表
                </van-button>
            </div>
        </van-cell-group>
      </van-form>
      <!-- 顶部弹出 -->
      <van-popup
        v-model:show="showTop"
        position="top"
        :style="{ height: '100%' }"
      >
        <div class="mapcanten">
            <van-button plain type="default" size="mini" @click="showTop = false">取消</van-button>
            <van-button type="success" size="mini" @click="clickSuccess">完成</van-button>
            <div id="map"></div>
            <div id="myPageTop">
                <!-- <input id="tipinput" type="text"> -->
                <div class="tipinput">
                    <van-search
                        id="tipinput"
                        v-model="search"
                        placeholder="搜索地点"
                        input-align="center"
                    >
                    </van-search>
                </div>
                <ul class="tipinputselelt" >
                    <li v-for="(sele,index) in selectList" :key="index" @click="selectbox(sele)">
                        {{ sele.name }}
                        <van-icon v-if="sele == indexcode" name="success" color="#13ff5b" />
                    </li>
                </ul>
            </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<style lang="less" scoped>
:deep(.van-nav-bar .van-icon) {
  color: #000;
}
.mapcanten{
    position: relative;
    width: 100%;
    height: 100%;
    #map {
        width: 100%;
        height: 100%;
    }
    .van-button:nth-child(1){
        position: absolute;
        top: 0.5rem;
        left: 5%;
        width: 4rem;
        z-index: 999;
    }
    .van-button:nth-child(2){
        position: absolute;
        top: 0.5rem;
        right: 5%;
        width: 4rem;
        z-index: 999;
    }
    #myPageTop{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 999;
        .tipinputselelt{
            height: 10.4rem;
            background: #fff;
            overflow: hidden;
            overflow-y: auto;
            padding: 0 0.5rem;
            li{
                line-height: 2rem;
                font-size: 1.2rem;
                border-bottom: 0.02rem solid #eee;
                position: relative;
                .van-icon{
                    position: absolute;
                    right: 5%;
                    top:25%;
                    bottom: 0;
                    margin: auto;
                    display: inline;
                }
            }
        }
    }
}

</style>
