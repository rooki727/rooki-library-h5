<template>
  <view class="carousel">
    <swiper indicator-dots autoplay="false" circular indicator-active-color="orange">
      <swiper-item v-for="item in bannerList" :key="item.book_id">
        <navigator
          :url="`/pages/book/book?book_id=${item.book_id}`"
          open-type="navigate"
          hover-class="none"
          class="navigator"
        >
          <image :src="item.main_picture" mode="aspectFit" class="image" />
        </navigator>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const prop = defineProps({
  bannerList: Array,
})
const bannerList = computed(() => prop.bannerList)
</script>

<style lang="scss" scoped>
// 轮播图
.carousel {
  height: 280rpx;
  .navigator,
  .image {
    width: 100%;
    height: 280rpx;
  }
}
</style>
