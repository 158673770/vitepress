import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('@/views/report/index.vue')
    },
    // 上报记录
    {
        name:'inforeport',
        path: '/inforeport',
        component: () => import('@/views/inforeport/index.vue')
    },
    // 上报反馈
    {
        name:'reportmsg',
        path: '/reportmsg',
        component: () => import('@/views/reportmsg/index.vue')
    },
    // 新闻
    // {
    //     path: '/',
    //     component: () => import('@/views/home/Home.vue')
    // },
    // {
    //     name:"homelis",
    //     path: '/homelis',
    //     component: () => import('@/views/homelis/homelis.vue')
    // }
    
];


const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;