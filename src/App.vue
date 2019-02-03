<template>
    <div id="app">
          <v-header  :seller="seller"></v-header>
          <div class="tab border-1px">
                <div class="tab-item">
                      <router-link   to="/goods" tag="a">商品</router-link>
                </div>
                <div class="tab-item">
                      <router-link    to="/ratings" tag="a">评价</router-link>
                </div>
                <div class="tab-item">
                        <router-link   to="/seller" tag="a">商家</router-link>
                </div>
          </div>
          <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">

  /*  导入header这个组件  */
  import  header  from './components/header/header'

  const ERR_OK = 0;
  export  default {
      /*  注册header这个组件  */
      data:function(){
          return{
              seller:{}
          }
      },
      created(){
           this.$http.get('./api/seller').then(function(response){
                  response = response.body;
                  if( response.errno === ERR_OK ){
                          this.seller = response.data;
                          console.log(this.seller);
                  }
           });
      },
      components:{
            'v-header' : header
      }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
     /*  引入css样式  */
     @import "./common/stylus/mixin.styl"
      #app
          .tab
              display:flex
              width: 100%
              height: 40px
              line-height :40px
              border-1px(rgba(7,17,27,0.1))
          .tab-item
              flex : 1
              text-align : center
          & > a
                font-size :14px
                color: rgb(77,85,93)
          .active
                color:red
</style>
