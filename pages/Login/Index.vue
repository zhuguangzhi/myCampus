<template>
	<view class="content">
		<image class="logo" src="/static/img/logo.png" mode="aspectFit"></image>
		<view class="login">
			<input type="text" class="base" maxlength="10" placeholder="学号/教职工号" v-model="userId" />
			<input type="password" class="base" placeholder="密码" v-model="password" />
			<text v-show="errTip" class="base errTip">{{errTip}}</text>
			<button type="default" open-type="getUserInfo" class='loginBtn base'  @getuserinfo="toLogin" >登录</button>
		</view>
		<text class="base tip">忘记密码请及时联系管理员</text>
		<Face v-if="checkFace" @checkResult="checkResult()"  :userId="userId"/>
	</view>
</template>

<script>
	import  { setStorage,getStorage,showLoading,toPage }  from '@/public/common/baseFn.js'
	import loginServer from '@/public/api/login.js'
	import UserConfig from '@/public/config/user.js'
	import Face from '@/components/face.vue'
	export default {
		name:"Login",
		data() {
			return {
				// userId:null,
				userId:'8120118001',
				// password:null,
				password:'88888888',
				errTip:null,
				// 人脸验证
				checkFace:false,
				// 设备型号
				stystemModel:null,
			};
			
		},
		components:{
			Face
		},
		async created() {
			showLoading()
			let stystem = uni.getSystemInfoSync()
			this.stystemModel = stystem.model
			
			// token验证
			let [err,res] = await loginServer.tokenLogin();
			uni.hideLoading();
			if(!this.$http.errorCheck(err,res)){
				return false;
			}
			this.toIndexPage(res.data.data);
		},
		methods:{
			// 登录
			async toLogin(){
				showLoading('登陆中')
				this.checkInfo() 
				const [uniError,uniData] = await uni.login();
				const [loginErr,loginData] = await loginServer.login(this.userId,this.password);
				
				// 校验是否错误
				if(!this.$http.errorCheck(loginErr,loginData))return false;
				const [checkOpenIdErr,checkOpenIdRes] = await loginServer.getOpenId(this.userId,this.stystemModel,uniData.code);
				if(!checkOpenIdRes.data.data.checkResult){
					// 验证未通过 进行其他辅助验证，如人脸识别验证，修改openId
					uni.hideLoading()
					// 开启人脸验证
					this.checkFace=true;
					// 将获取到的用户信息缓存在store中
					this.$store.commit('setUserInfo',loginData.data.data)
					return false; 
				}
				// 判断是否是第一次登录，要求修改密码
				if(loginData.data.data.isLogin===0){}
				uni.hideLoading()
				// 页面跳转
				this.toIndexPage(loginData.data.data)
			},
			// 检验输入框信息
			checkInfo(){
				if(!this.password && !this.userId){
					this.errTip = '请填写密码'
					return false
				}
				this.errTip=''
			},
			// 页面跳转
			toIndexPage(userInfo){
				//存储用户信息
				setStorage('userInfo',userInfo);
				// 重新配置缓存信息
				UserConfig.userInfo = getStorage('userInfo')
				toPage('/pages/TimeTable/TimeTable','switchTab');
			},
			checkResult(res){
				if(res){
					// 通过, 去往确认页
					toPage(`/pages/Login/Confirm?userId=${this.userId}`);
				}
				this.checkFace=false;
				
			}
		},
		
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 750rpx;
		height: 100vh;
		background-color: #FFFFFF;
	}
	.logo {
		width: 500rpx;
	}
	.login {
		width: 500rpx;
		.errTip {
			position: absolute;
			color: red;
			font-size: 12px;
		}
		input {
			width: 100%;
			height: 50px;
			border-bottom: 1px solid;
			margin-bottom: 10px;
			text-align: left;
			color: var(--color);
		}
		.loginBtn {
			width: 100%;
			height: 40px;
			margin-top: 60px;
			border-radius: 5px;
			outline: none;
			background-color: var(--color);
			color: #FFFFFF;
			font-size: 18;
			line-height: 40px;
		}
	}
	.tip {
		display: inline-block;
		position: absolute;
		bottom: 20px;
		width: 100%;
		color: var(--color);
		font-size: 12px;
	}
	
</style>
