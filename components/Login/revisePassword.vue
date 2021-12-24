<template>
	<view class="animated fadeInLeftBig revise">
		<text class="text" @click="$emit('revise',true)">关闭</text>
		<input v-if="clock" class="inputBox"  v-model="oldPassword"  placeholder="请输入密码" />
		<view v-else>
			<input class="inputBox" @blur="validata()" v-model="newPassword"  placeholder="请输入新密码" />
			<input class="inputBox" @blur="validata()" v-model="checkPassword"  placeholder="请再次输入密码" />
		</view>
		<button class="submit" @click="submit()">{{subMsg}}</button>
	</view>
</template>

<script>
	import loginServer from '@/public/api/login.js'
	import UserConfig from '@/public/config/user.js'
	import {message} from '@/public/common/baseFn.js'
	export default {
		name:"RevisePassword",
		data(){
			return{
				oldPassword:'',
				// 验证过密码后解开
				clock:true,
				newPassword:'',
				checkPassword:'',
				subMsg:'验证'
			}
		},
		methods:{
			async submit(){
				let err,res
				let userId = UserConfig.userInfo.userId
				if(this.clock){
					// 校验密码
					[err,res]=await loginServer.checkPassword(userId,this.oldPassword);
					if(!this.$http.errorCheck(err,res)) {
						this.oldPassword = ''
						return false
					}
					this.clock=false;
					this.subMsg="修改";
					return true;
				}
				let val=this.validata();
				if (!val) return false;
				// 修改密码
				[err,res]=await loginServer.revisePassword(userId,this.newPassword);
				if(!this.$http.errorCheck(err,res)) return false
				message('修改成功')
				this.$emit('revise',true);
			},
			validata(){
				if(this.checkPassword==='' || this.newPassword==='') return false
				if(this.checkPassword!==this.newPassword){
					message('两次密码不一致');
					return false;
				}
				return true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '/static/css/base.css';
	@import '/static/css/animate.min.css';
	.revise {
		position: absolute;
		top: 15vh;
		left: 10vw;
		z-index: 2;
		width: 80vw;
		padding: 20px 20px 40px 20px;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 10px;
		box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.3);
		.text {
			position: relative;
			display: block;
			height: 30px;
			line-height: 30px;
			font-size: 18px;
			margin-bottom: 20px;
			.del {
				position: absolute;
				display: inline-block;
				height: 30px;
				line-height: 30px;
				right: 10px;
			}
		}
		.inputBox {
			width: 100%;
			height: 50px;
			line-height: 50px;
			margin-bottom: 10px;
			font-size: 16px;
			color: var(--color);
			border-bottom: 1px solid #999999;
		}
		.submit {
			width: 100%;
			height: 50px;
			border-radius: 5px;
			color: #FFFFFF;
			font-size: 16px;
			line-height: 50px;
			margin-top: 30px;
			text-align: center;
			background-color: var(--color);
		}
		
	}
</style>
