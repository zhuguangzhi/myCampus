<template>
	<view class="content">
		<text class="title">确认更改绑定到该微信和设备</text>
		<view class="info">
			<text>还剩绑定次数：<text class="time">{{num}}</text></text>
			<text>下次重置时间：<text class="time">{{time}}</text></text>
		</view>
		<button class="confirmBtn" @click="confirmBtn()">绑定</button>
		<RevisePassword v-if="isFrist" @revise="revise"/>
	</view>
</template>

<script>
	import LoginServe from '@/public/api/login.js';
	import { showLoading,setStorage,toPage,getStorage } from '@/public/common/baseFn.js'
	import UserConfig from '@/public/config/user.js'
	import RevisePassword from '@/components/Login/revisePassword.vue'
	export default {
		name:'Confirm',
		data() {
			return {
				num:'',
				time:'',
				userId:'',
				// 是否需要修改密码
				isFrist:false,
			};
		},
		components:{
			RevisePassword
		},
		onLoad(options) {
			this.userId = options.userId
		},
		mounted() {
			let Info = this.$store.getters.getUserInfo['bindInfo'];
			if(Info!=null && Info!==false){
				this.num=Info.bindNum.toString();
				this.time=Info.deadline.toString();
				return false
			}
			this.num="暂未绑定";
			this.time="暂未绑定";
			this.isFrist=true;
			
		},
		methods:{
			async confirmBtn(){
				showLoading();
				// 绑定用户设备和微信id
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
				
			},
			// 修改密码按钮
			revise(res){
				if(res){
					this.isFrist=false;
				}
			}
		},
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	@import '/static/css/animate.min.css';
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
