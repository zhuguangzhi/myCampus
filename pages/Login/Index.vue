<template>
	<view class="content">
		<image class="logo" src="/static/img/logo.png" mode="aspectFit"></image>
		<view class="login">
			<input type="text" class="base" maxlength="10" placeholder="学号/教职工号" v-model="userId" />
			<input type="password" class="base" placeholder="密码" v-model="password" />
			<text v-show="errTip" class="base errTip">{{errTip}}</text>
			<button type="default" open-type="getUserInfo" class='loginBtn base' @tap="requestSubscibe()" >登录</button>
		</view>
		<text class="base tip">忘记密码请及时联系管理员</text>
		<Face v-if="checkFace" @checkResult="checkResult()" :face="faceType"  :userId="userId"/>
	</view>
</template>

<script>
	import  { setStorage,getStorage,showLoading,toPage,showModel }  from '@/public/common/baseFn.js'
	import loginServer from '@/public/api/login.js'
	import UserConfig from '@/public/config/user.js'
	import baseConfig from '@/public/config/BaseConfig.js'
	import Face from '@/components/Login/face.vue'
	export default {
		name:"Login",
		data() {
			return {
				userId:null,
				password:null,
				errTip:null,
				// 人脸验证
				checkFace:false,
				// 设备型号
				systemModel:null,
				// 人脸类型
				faceType:'checkFace',
				userInfo:null,
			};
			
		},
		components:{
			Face
		},
		async created() {
			showLoading()
			let stystem = uni.getSystemInfoSync()
			this.systemModel = stystem.model
			// token验证
			let [err,res] = await loginServer.tokenLogin();
			uni.hideLoading();
			if(res.data.errorCode){
				return false;
			}
			this.userInfo = res.data.data
			this.toIndexPage(res.data.data);
		},
		methods:{
			// 登录
			async toLogin(){
				// 消息订阅 
				showLoading('登陆中')
				this.checkInfo() 
				const [uniError,uniData] = await uni.login();
				let params = {
					'userId':this.userId,
					'password':this.password,
					'code':uniData.code,
					'systemId':this.systemModel
				}
				const [loginErr,loginData] = await loginServer.login(params);
				// 校验是否错误
				if(!this.$http.errorCheck(loginErr,loginData))return false;
				
				uni.hideLoading()
				let data = loginData.data.data;
				// opid进行校验
				console.log('data',data)
				if(data.bindInfo!==true){
					// 第一次登录，要求修改密码 
					// 将获取到的用户信息缓存在store中
					this.$store.commit('setUserInfo',loginData.data.data)
					UserConfig.userInfo={
						'bindInfo':false
					};
					// 第一次登录 录入人脸
					this.faceType="create"
					this.checkFace=true;
					return false;
				}else if(data.openId===false){
					// 不同账号，须人脸验证
					this.$store.commit('setUserInfo',loginData.data.data)
					UserConfig.userInfo={
						'bindInfo':false
					};
					this.faceType="faceCheck"
					this.checkFace=true;
					return false;
				}

				// 页面跳转
				this.toIndexPage(data)
			},
			async requestSubscibe(){
				if(this.userId[0]!=='t'){
					// 学生登录
					this.toLogin();
					return false
				};
				// 教师登录
				await uni.requestSubscribeMessage({
					tmplIds:baseConfig.subscribeLeaveApply,
					success:(res)=>{
						this.toLogin();
					}
				})
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
			async toIndexPage(userInfo){
				//存储用户信息
				await setStorage('userInfo',userInfo);
				// 重新配置缓存信息
				UserConfig.userInfo = await  getStorage('userInfo')
				toPage('/pages/TimeTable/TimeTable','switchTab');
				// toPage('/pages/Dynamic/CreateDynamic')
			},
			checkResult(res){
				if(res){
					// 通过, 去往确认页
					toPage(`/pages/Login/Confirm?userId=${this.userId}`);
				}
				this.checkFace=false;
				
			},
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
