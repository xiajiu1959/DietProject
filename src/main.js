// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
/* 安装vue-router后,引入这个包 */
import VueRouter from 'vue-router'
import  VueResource from 'vue-resource'
import App from './App'
//  导入组件
import  goods from './components/goods/goods'
import  ratings from './components/ratings/ratings'
import  seller  from  './components/seller/seller.vue'
// 导入集合样式
import './common/stylus/index'



Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
      {path:'/goods',component:goods},
      {path:'/ratings',component:ratings},
      {path:'/seller',component:seller},
];
const  router = new VueRouter({
      routes,
      linkActiveClass:'active',
      linkExactActiveClass:'active'
});


/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    router
}).$mount("#app");

/*
      vue2.0 使用router.go()这个方法会不停的刷新页面,得不到
                      页面跳转到我们指定的页面
           vue2.0使用push()这个方法,据说是为了和history api 保持一致
*
*/

// router.go('/ratings');
router.push('/goods');




