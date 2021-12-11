<template>
	<view class="content">
		<text class="title">确认更改绑定到该微信和设备</text>
		<view class="info">
			<text>还剩绑定次数：<text class="time">{{num}}</text></text>
			<text>下次重置时间：<text class="time">{{time}}</text></text>
		</view>
		<button class="confirmBtn" :disabled="isDisable" @click="confirmBtn()">绑定</button>
	</view>
</template>

<script>
	import LoginServe from '@/public/api/login.js';
	import { showLoading,setStorage,toPage,getStorage } from '@/public/common/baseFn.js'
	import UserConfig from '@/public/config/user.js'
	export default {
		name:'Confirm',
		data() {
			return {
				num:'',
				time:'',
				userId:''
			};
		},
		computed:{
			isDisable(){
				return this.num>0?false:true
			}
		},
		onLoad(options) {
			showLoading();
			this.userId = options.userId
		},
		async mounted() {
			let [err,res] = await LoginServe.getBindNum(this.userId);
			if (!this.$http.errorCheck(err,res)) return false;
			let data = res.data.data;
			uni.hideLoading();
			this.num = data.bindNum.toString();
			this.time = data.deadline.toString();
		},
		methods:{
			async confirmBtn(){
				showLoading();
				let [err,res] = await LoginServe.bindOpenId(this.userId);
				if(!this.$http.errorCheck(err,res)) return false;
				// 通过
				// 将用户信息存在本地
				let userInfo = this.$store.getters.getUserInfo;
				setStorage('userInfo',userInfo);
				// 重新配置缓存信息
				UserConfig.userInfo = getStorage('userInfo')
				uni.hideLoading();
				toPage('/pages/TimeTable/TimeTable','switchTab');
				
			}
		},
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
.content {
	box-sizing: border-box;
	padding: 20px;
	width: 100vw;
	height: 100vh;
}
.title {
	display: block;
	width: 100%;
	height: 50px;
	font-size: 18px;
	font-weight: bold;
	color: #000000;
	font-weight: bolder;
	text-align: center;
	line-height: 50px;
}
.info {
	width: 100%;
	padding: 30px 0;
	text{
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		display: block;
		border-bottom: 1px solid #EEEEEE;
		.time {
			display: inline-block;
			color: var(--color);
		}
	}
}
.confirmBtn {
	background-color: var(--color);
	color:#FFFFFF;
	margin-top: 40px;
}

</style>
