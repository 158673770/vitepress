import request from '@/utils/request'

// 问题分类
export function slapList(){
    return request({
        url:"/index.php/api/slap/type",
        method:"get"
    })
}
// 图片上传
export function addFile(file){
    return request({
        url:"/index.php/api/WeChat/add_file",
        method:"post",
        data:file
    })
}
// 上报列表
export function slaplists(){
    return request({
        url:"/index.php/api/slap/index",
        method:"post",
        data:{
            pagesize:20
        }
    })
}

// 上报反馈
export function addInfo(data){
    return request({
        url:"/index.php/api/slap/add_info",
        method:"post",
        headers:{
            'Content-Type':'multipart/form-data'
        },
        data
    })
}
// http://ssp.140.161.alsite.veeteam.com/index.php/api/slap/add_info
// http://ssp.140.161.alsite.veeteam.com/index.php/api/slap/index
// http://ssp.140.161.alsite.veeteam.com/index.php/api/WeChat/add_file
// /index.php/api/slap/type