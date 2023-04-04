import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from "unplugin-auto-import/vite";
import path from 'path'

export default {
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      imports:["vue","vue-router"]
    })
  ],
   // 配置代理
   server:{
    host: '0.0.0.0' ,
    proxy:{
      '/api':{
        // // 新闻
        // target:'http://cwgk.140.161.alsite.veeteam.com',//替换的服务端地址
        // 随手拍
        target:'http://ssp.140.161.alsite.veeteam.com',//替换的服务端地址
        changeOrigin:true,//开启代理，允许跨域
        rewrite:path=>path.replace(/^\/api/,'') // 设置重写的路径
      }
    }
  },
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src')
    }
  }
};