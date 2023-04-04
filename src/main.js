import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from '@/router';
import Rem from './utils/rem'
// 2. 引入组件样式
// import 'vant/lib/index.css';
import 'vant/es/toast/style';
createApp(App).use(router).mount('#app');
// VueAMap.initAMapApiLoader({
//     key: '2107e08f79dbed187b1fe9398b79d956',
//     plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
//     v: '1.4.4'
// });
Rem.setFontSize();
