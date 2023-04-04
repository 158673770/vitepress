import request from '@/utils/request'

export function journalismList(){
    return request({
        url:"/index.php/home/index/category",
        method:"get"
    })
}
export function infosList(data){
    console.log("data",data)
    return request({
        url:`/index.php/home/index/infos?pagesize=${data.pagesize}&sid=${data.sid}&villageid=${data.villageid}`,
        method:"get",
        
    })
}

export function contentData(data){
    return request({
        url:`/index.php/home/index/content?id=${data}` ,
        method:"post",
    })
}

// 乡镇
export function xzData(){
    return request({
        url:`index.php/home/index/town` ,
        method:"get",
    })
}
// 村庄
export function czData(id){
    return request({
        url:`/index.php/home/index/village?id=${id}` ,
        method:"get",
    })
}
// export function fljournalismList(data){
//     return request({
//         url:`/index.php/home/index/category?sid=${data.sid}&pagesize=100&villageid=${data.villageid}`,
//         method:"get"
//     })
// }
// /index.php/home/index/village