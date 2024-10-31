<template>
  <view class="content" :style="{ paddingTop: navbarHeight + 'px' }">
    <view class="title"><text>登录账号</text></view>
  </view>
  <view class="forms">
    <uni-forms :modelValue="formData" :rules="rules" ref="form">
      <uni-forms-item
        name="account"
        :rules="[{ required: true, errorMessage: '请输入账号' }]"
        class="itemInput"
      >
        <uni-easyinput
          class="inputItem"
          type="number"
          v-model="formData.account"
          placeholder="请输入账号"
          :placeholderStyle="'font-size:14px'"
          :inputBorder="false"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item
        name="password"
        :rules="[{ required: true, errorMessage: '请输入密码' }]"
        class="itemInput"
      >
        <uni-easyinput
          class="inputItem"
          type="password"
          v-model="formData.password"
          placeholder="请输入密码"
          :placeholderStyle="'font-size:14px'"
          :inputBorder="false"
        ></uni-easyinput>
      </uni-forms-item>
    </uni-forms>
    <button
      @click="submitForm"
      class="submitBtn"
      :style="{
        backgroundColor: canSubmit ? 'rgb(43, 179, 233)' : 'skyblue',
        color: canSubmit ? 'white' : '#78767696',
      }"
    >
      登录
    </button>
    <view style="margin-top: 4%">
      <view class="checkboxView">
        <checkbox
          value="choose"
          :checked="formData.checked"
          style="transform: scale(0.7)"
          @click="onCheck"
        />
        <view style="font-size: 12px" @tap="onCheck"
          >已阅读并同意<text style="color: skyblue">服务协议</text> 和<text style="color: skyblue"
            >商城隐私保护指引</text
          >
        </view>
      </view>
    </view>
  </view>
  <!-- 底部操作区 -->
  <view class="controlBottom">
    <view class="control">
      <view class="circle">
        <uni-icons type="person" size="23"> </uni-icons>
      </view>
      <view class="controlText">其他方式登录</view>
    </view>
    <navigator url="/pages/register/register" open-type="navigate" hover-class="none">
      <view class="control">
        <view class="circle"><uni-icons type="plusempty" size="23"> </uni-icons> </view>
        <view class="controlText">注册</view>
      </view>
    </navigator>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { loginUserAPI } from '@/apis/user'
import { getAddressListByIdAPI } from '@/apis/address'
import { useMemberStore } from '@/stores/modules/member'
import { useAddressStore } from '@/stores/modules/address'
const addressStore = useAddressStore()
//获取屏幕边界
const { safeArea } = uni.getSystemInfoSync()
//获取导航栏高度
const navbarHeight = safeArea?.top
const form = ref(null)
const memberStore = useMemberStore()
const canSubmit = ref(false)
// 规则
const rules = ref({
  account: [
    {
      required: true,
      errorMessage: '请输入账号',
    },
  ],
  password: [
    {
      required: true,
      errorMessage: '请输入密码',
    },
  ],
})
const formData = ref({
  account: '',
  password: '',
  checked: false,
})
const onCheck = () => {
  formData.value.checked = !formData.value.checked
  canSubmit.value = !canSubmit.value
}
const submitForm = () => {
  form.value
    .validate()
    .then(async () => {
      if (formData.value.checked) {
        await loginUserAPI(parseInt(formData.value.account), formData.value.password)
          .then(async (res) => {
            if (res.code !== '-1') {
              memberStore.setProfile(res)
              clearForm()
              const addressRes = await getAddressListByIdAPI(parseInt(res.user_id))
              const defaultAddress = addressRes.result.find((item) => item.isDefault === 1)
              addressStore.setDefaultAddress(defaultAddress)
              addressStore.changeSelectedAddress(defaultAddress)
              uni.showToast({ title: '登录成功', icon: 'success', duration: 2000 })
              setTimeout(() => {
                // 页面跳转
                uni.switchTab({ url: '/pages/my/my' })
              }, 500)
            } else {
              uni.showToast({
                title: '网络错误！',
                icon: 'none',
                duration: 2000,
              })
            }
          })
          .catch((err) => {
            console.log(err)
            uni.showToast({
              title: '登录失败，请检查账号密码是否正确',
              icon: 'error',
              duration: 2000,
            })
          })
      } else {
        uni.showToast({ title: '请阅读并同意协议', icon: 'error', duration: 2000 })
      }
    })
    .catch((err) => {
      console.log('表单错误信息：', err)
    })
}
const clearForm = () => {
  formData.value = {
    account: '',
    password: '',
    checked: false,
  }
}
</script>

<style lang="scss" scoped>
page {
  background: linear-gradient(
    to bottom,
    rgba(208, 243, 211, 0.6),
    rgba(214, 239, 216, 0.5),
    rgba(226, 246, 228, 0.4),
    rgba(234, 245, 235, 0.3),
    rgba(242, 247, 243, 0.2),
    rgba(247, 248, 247, 0.1)
  );
}

.content {
  text-align: center;
  .title {
    color: #00000096;
    margin-top: 4%;
    font-size: 42rpx;
  }
}
.forms {
  margin-top: 20%;
  text-align: center;
}
.checkboxView {
  display: flex;
  align-items: center;
  margin-left: 16%;
}

.inputItem {
  background: white;
  height: 40px !important;
  width: 70% !important;
  margin: 0 auto;
}

.submitBtn {
  width: 70%;
  height: 40px;
  font-size: 14px;
}
.controlBottom {
  margin: 65% auto;
  display: flex;
  justify-content: center;
  .control {
    display: flex;
    flex-direction: column;
    align-items: center; /* 垂直方向居中对齐 */
    margin: 0 6px; /* 水平方向间距 */
    text-align: center;
    .circle {
      text-align: center;
      border: 1px solid #e8e3e3;
      width: 35px;
      height: 35px;
      line-height: 35px;
      border-radius: 50%;
    }
    .controlText {
      font-size: 11px;
    }
  }
}
</style>
