<template>
  <scroll-view :scroll-y="true" class="scroll" @scrolltolower="onScrolltolower" enable-back-to-top>
    <view class="midContent">
      <view class="isLogin" v-if="memberStore.profile">
        <navigator
          url="/pagesMember/profile/profile"
          open-type="navigate"
          hover-class="none"
          style="width: 70%"
        >
          <view class="loginCard"
            ><image
              mode="aspectFill"
              class="awatar"
              :src="awatar ? awatar : '../../static/images/OIP-C.jpg'"
            /><view class="midInfo">
              <view style="overflow: hidden">{{
                memberStore.profile.name
                  ? memberStore.profile.name
                  : '账号' + memberStore.profile.account
              }}</view>
              <view class="goProfile">点击修改信息</view>
            </view>
          </view>
        </navigator>
        <navigator url="/pagesMember/settings/settings" open-type="navigate" hover-class="none">
          <view class="goSettings">设置</view>
        </navigator>
      </view>
      <view class="isNotLogin" v-else>
        <navigator
          url="/pages/login/login"
          open-type="navigate"
          hover-class="none"
          style="width: 50%"
        >
          <view class="loginCard"
            ><image mode="aspectFill" class="awatar" src="../../static/images/remove.png" /><view
              class="midInfo"
            >
              <view class="goLogin">点击登陆/注册</view>
            </view>
          </view>
        </navigator>
        <navigator url="/pagesMember/settings/settings" open-type="navigate" hover-class="none">
          <view class="goSettings">设置</view>
        </navigator>
      </view>
    </view>
    <view class="orderFour">
      <view class="orderTitle">
        <view class="myorder">我的订单</view>
        <navigator
          :url="`/pagesOrder/orderList/orderList?type=${0}&status=${'全部'}`"
          open-type="navigate"
          hover-class="none"
          class="goToAllOrder"
        >
          <view>查看所有订单<uni-icons type="right" size="14"></uni-icons> </view
        ></navigator>
      </view>
      <view class="orderContent">
        <navigator
          v-for="item in orderTitle"
          :key="item.type"
          :url="`/pagesOrder/orderList/orderList?type=${item.type}&status=${item.name}`"
          open-type="navigate"
          hover-class="none"
        >
          <view class="orderVerify">
            <view class="orderNumber" v-show="statusCountList[item?.type]?.count > 0">{{
              statusCountList[item?.type]?.count
            }}</view>
            <uni-icons custom-prefix="iconfont" :type="item.icon" size="30"></uni-icons
            >{{ item.name }}
          </view>
        </navigator>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <view><GuessLike ref="guessLikeRef"></GuessLike></view>
  </scroll-view>
</template>

<script setup>
import { useMemberStore } from '@/stores/modules/member'
import GuessLike from '@/components/guessLike.vue'
import { computed, ref } from 'vue'
import { findCountStatusAPI } from '@/apis/order'
import { onShow } from '@dcloudio/uni-app'

const memberStore = useMemberStore()
const user_id = computed(() => memberStore.profile.user_id)

const guessLikeRef = ref(null)
const onScrolltolower = () => {
  guessLikeRef.value?.getMore()
}

const orderTitle = [
  { type: 1, name: '待付款', icon: 'icon-daifukuan' },
  { type: 2, name: '待发货', icon: 'icon-daifahuo' },
  { type: 3, name: '待收货', icon: 'icon-daishouhuo' },
  { type: 4, name: '待评价', icon: 'icon-31daipingjia' },
  { type: 5, name: '已退款', icon: 'icon-tuikuanshouhou' },
]
const statusCountList = ref([
  { status: '待付款', count: 0 },
  { status: '待发货', count: 0 },
  { status: '待收货', count: 0 },
  { status: '待评价', count: 0 },
  { status: '已退款', count: 0 },
])
// 创建一个新的数组，用于存储合并后的数据
const findCountStatus = async () => {
  if (!user_id.value) {
    statusCountList.value = []
    return
  }
  const res = await findCountStatusAPI(user_id.value)
  if (res.code == '1') {
    statusCountList.value = res.result
  }
}
const awatar = computed(() => memberStore.profile?.awatar)
onShow(() => {
  findCountStatus()
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f4f4;
}
.scroll {
  flex: 1;
  height: 0;
}
.midContent {
  padding-top: 55px;
  height: 10%;
  width: 100%;
  position: relative;
  background: linear-gradient(
    to bottom,
    rgba(247, 20, 20, 0.7),
    rgba(249, 40, 40, 0.6),
    rgba(242, 70, 70, 0.6),
    rgba(238, 98, 98, 0.6),
    rgba(237, 148, 148, 0.6),
    rgba(239, 165, 165, 0.6)
  );
  .loginCard {
    display: flex;
    margin-left: 6%;
    .awatar {
      border: 1px solid #d6d3d3;
      border-radius: 50%;
      height: 50px;
      width: 50px;
    }
    .midInfo {
      font-size: 20px;
      margin-left: 10px;
      color: white;
      max-width: 80%;
      .goProfile {
        width: 80px;
        text-align: center;
        border: 1px solid white;
        margin-top: 5px;
        font-size: 12px;
        border-radius: 15px;
      }
    }
  }
  // 设置按钮
  .goSettings {
    text-align: center;
    height: 30px;
    width: 50px;
    position: absolute;
    right: 5%;
    top: 72%;
    color: white;
  }
  // 去登录
  .goLogin {
    margin-top: 15px;
    font-size: 14px;
  }
}

// 订单板块
.orderFour {
  padding-top: 10px;
  margin-top: 3px;
  margin-left: 4%;
  height: 16%;
  width: 92%;
  background-color: white;
  border-radius: 5px;
  .orderTitle {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 3%;
    .myorder {
      margin-left: 10px;
      margin-top: 2%;
    }
    .goToAllOrder {
      margin-right: 10px;
      margin-top: 4%;
    }
  }
  .orderContent {
    margin-top: 15px;
    display: flex;
    justify-content: space-evenly;
    .orderVerify {
      position: relative;
      margin-top: 3px;
      font-size: 12px;
      text-align: center;
      height: 60px;
      width: 55px;
      display: flex;
      flex-direction: column;
      .orderNumber {
        text-align: center;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background-color: rgb(255, 128, 0);
        color: white;
        position: absolute;
        top: 0;
        right: 5%;
      }
    }
  }
}
</style>
