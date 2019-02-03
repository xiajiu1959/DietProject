<template>
      <div id="goods">
              <!--左侧menu布局-->
              <div class="menu-wrapper" ref="menuWrapper">
                      <ul>
                              <li v-for="(item, index) in  goods" class="menu-item border-1px"  :class="{ current:currentIndex===index}" >
                                      <span class="text   border-1px">
                                                  <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
                                      </span>
                              </li>
                      </ul>
              </div>
              <!--右侧foods食品列表布局-->
              <div class="foods-wrapper"  ref="foodWrapper">
                   <ul>
                          <li v-for="item in goods" class="food-list  food-list-hook">
                                <h1 class="title">{{item.name}}</h1>
                                <ul>
                                        <li v-for="food in item.foods" class="food-item  border-1px">
                                                <div class="icon">
                                                        <img :src="food.icon"  alt=""  width="57">
                                                </div>
                                                <div class="content">
                                                        <h2 class="name">{{food.name}}</h2>
                                                        <p class="desc">{{food.description}}</p>
                                                        <div class="extra">
                                                                <span class="count">月售{{food.sellCount}}</span>
                                                                <span class="count">好评{{food.rating}}</span>
                                                        </div>
                                                        <div class="price">
                                                                <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                                        </div>
                                                        <div class="cartControl-wrapper"></div>
                                                </div>
                                          </li>
                                </ul>
                          </li>
                    </ul>
              </div>
      </div>
</template>

<script type="text/javascript">
      import BScroll from 'better-scroll'
      const ERR_OK = 0;
      export default {
            props:{
                seller:{
                    type:Object
                }
            },
            data:function(){
                  return{
                         goods : [],
                         listHeight : [],
                         scrollY: 0
                  };
             },
            created:function(){
                  this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
                  this.$http.get('./api/goods').then(function(response){
                        response = response.body;
                        if( response.errno === ERR_OK ){
                              this.goods = response.data;
                              console.log(this.goods);
                              this.$nextTick(function(){
                                       this.initScroll();
                                       this.calculateHeight();
                              });
                        }
                  });
            },
            methods:{
                    initScroll(){
                              this.menuWrapper = new BScroll(this.$refs.menuWrapper, {click:true});
                              this.foodWrapper = new BScroll(this.$refs.foodWrapper, {
                                      probeType:3,
                                      click:true
                              });
                              let _this = this;
                              this.foodWrapper.on('scroll',function(){
                                    _this.scrollY = Math.abs(Math.round(this.y))
                              });
                    },
                    calculateHeight:function(){
                            let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook'); //获取每一个food的dom对象
                            let height = 0;
                            this.listHeight.push(height); //初始化第一个高度为0
                            for (let i = 0; i < foodList.length; i++) {
                                    let item = foodList[i]; //每一个item都是刚才获取的food的每一个dom
                                    height += item.clientHeight; //主要是为了获取每一个foods内部块的高度
                                    this.listHeight.push(height);
                            }
                    }
            },
            computed:{
                  currentIndex:function(){
                        for( let i=0;i<this.listHeight.length;i++ ){
                              let height1 = this.listHeight[i];
                              let height2 = this.listHeight[i+1];
                              if( !height2  ||  (this.scrollY >=  height1 && this.scrollY < height2) ){
                                      return i; // 返回这个menu子块的索引
                              }
                        }
                        return 0;
                  }
            }
      }
</script>

<style lang="stylus" rel="stylesheet/stylus">
      @import "../../common/stylus/mixin.styl"
      #goods
                display flex
                position absolute
                top  174px
                bottom 46px
                width 100%
                overflow hidden
      .menu-wrapper
                flex 0 0 80px
                width 80px
                background-color #f3f5f7
      .menu-wrapper  .menu-item
                 display table
                 height 54px
                 width 56px
                 line-height 14px
                 padding 0 12px
                 &.current
                        position relative
                        margin-top 10
                        background-color #fff
                        .text
                              border-none()
                              font-weight 700

      .menu-wrapper .menu-item  .icon
                  display inline-block
                  width 16px
                  height 16px
                  vertical-align top
                  margin-right 2px
                  background-size 16px 16px
                  background-repeat no-repeat
                  &.decrease
                          bg-image('decrease_3')
                  &.discount
                          bg-image('discount_3')
                  &.guarantee
                          bg-image('guarantee_3')
                  &.invoice
                          bg-image('invoice_3')
                  &.special
                          bg-image('special_3')
      .menu-wrapper   .menu-item .text
                  display table-cell
                  width 56px
                  vertical-align middle
                  border-1px(rgba(7,17,27,0.1))
                  font-size 12px
      .foods-wrapper
                  flex  1
      .foods-wrapper .title
                  padding-left :14px
                  height :26px
                  line-height :26px
                  border-left :2px solid #d9dde1
                  font-size :14px
                  color: rgb(147,153,159)
                  background-color:  #f3f5f7
                  margin-top 0
      .foods-wrapper  .food-item
                  display flex
                  margin 18px
                  font-size 0
                  border-1px(rgba(7,17,27,0.1))
                  .icon
                        flex  0  0 57px
                        margin-right 10px
                  .content
                        flex 1
                        margin: 0
                        font-size 12px
                        .name
                                margin: 2px 0 8px 0
                                height: 14px
                                line-height 14px
                                font-size 14px
                                color: rgb(7,17,27)
                        .desc,.extra
                                line-height 10px
                                font-size 10px
                                color: rgb(147,153,159)
                        .desc
                                margin-bottom 8px
                                line-height 12px
                        .extra
                            &.count
                                margin-right 12px
                        .price
                                font-weight 700
                                line-height 24px
                                .now
                                      margin-right:8px
                                      font-size 14px
                                      color: rgb(240,20,20)
                                .old
                                      text-decoration line-through
                                      font-size 10px
                                      color:rgb(147,153,159)
      .food-item:last-child
                  border-none()
                  margin-bottom 0
</style>
