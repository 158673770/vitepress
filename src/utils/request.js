import axios from 'axios';
 
//1. 创建axios对象
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.DEV ? '/api' : '/',
  // 超时
  timeout: 10000
});
 
//2. 请求拦截器
service.interceptors.request.use(config => {
  return config;
}, error => {
  Promise.reject(error);
});
 
//3. 响应拦截器
service.interceptors.response.use(response => {
  //判断code码
  return response.data;
},error => {
  return Promise.reject(error);
});
 
export default service;