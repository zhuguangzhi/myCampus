<template>
	<view class="LeaveContent">
		<view class="UserInfo">
			<view class="photo">
				<image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode="aspectFill"></image>
				<image v-else :src="defaultPhoto" mode="aspectFill"></image>
			</view>
			<view class="info">
				<view class="line1">
					<text class="name">{{userInfo.name}}</text>
					<text class="sign">{{computedIdentity}}</text>
					<text class="userSet">个人空间 ></text>
				</view>
				<view v-if="!userInfo.isTeacher" class="line2">
					<text>{{userInfo.class_list.name}}</text>
					<text>{{userInfo.class_list.depart.d_name}}</text>
				</view>
				<view v-else class="line2">
					<text>工号：{{userInfo.userId}}</text>
					<text>{{userInfo.depart_list.d_name}}</text>
				</view>
			</view>
		</view>
		<view class="choice">
			<view class="msg">
				<text>我的服务</text>
			</view>
			<view class="choiceItem">
				<view class="leave item" @click="routePush(1)">
					<image class="img" src="../../static/img/iconfont/leave.svg" mode=""></image>
					<text>请假</text>
				</view>
				<view class="LeaveCancellation item">
					<image class="img" src="../../static/img/iconfont/leaveCancel.svg" mode=""></image>
					<text>销假</text>
				</view>
				<view class="singIn item" @click="routePush(3)">
					<image class="img" src="../../static/img/iconfont/singIn.svg" mode="">
						<text>签到</text>
					</image>
				</view>
			</view>
		</view>
		<view class="userServers">
			<view class="servers" v-for="(item,index) in severList" :key="index" @click="choiceServers(index)">
				<text class="serversName">{{item}}</text>
				<text class="arror_right">></text>
			</view>
		</view>
	</view>
</template>

<script>
	import User from '@/public/config/user.js'
	import BaseConfig from '@/public/config/BaseConfig.js'
	import  { toPage }  from '@/public/common/baseFn.js'
	export default {
		name:'Leave',
		created() {
			this.userInfo = User.userInfo
			
		},
		data() {
			return {
				userInfo:null,
				defaultPhoto:BaseConfig.staticUrl+'/image/defaultPhoto.jpeg',
				severList:[
					'请假信息',
					'考勤记录',
					'动态收藏',
					'动态历史',
					'我的消息'
				]
			}
		},
		computed:{
			computedIdentity(){
				if(this.userInfo.isTeacher){
					return '教师'
				}else{
					return '学生'
				}
			}
		},
		methods: {
			// 选择服务
			choiceServers(index){
				let page;
				switch(index){
					case 0:
						page = 'LeaveInfo';
						break;
					case 3:
						page = 'Sign';
						break;
					default:
						return false;
				}
				toPage(`/pages/Leave/Mine/${page}`);
				
			},
			// 页面跳转
			routePush(index){
				let route = [];
				if(this.userInfo.isTeacher) {
					// 教师端
					return false
				}else {
					// 学生端
					route = ['toLeave','LeaveCancle','Sign/studentSign']
				}
				toPage(`/pages/Leave/Mine/${route[index - 1]}`)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.LeaveContent {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	.UserInfo{
		display: flex;
		width: 100%;
		padding: 20px 10px 70px;
		background-color: var(--color);
		.photo {
			width: 50px;
			height: 50px;
			border: 1px solid #FFFFFF;
			border-radius: 80px;
			overflow: hidden;
			image {
				width: 50px;
				height: 50px;
			}
		}
		.info {
			flex: 1;
			height: 50px;
			padding-left: 10px;
			.line1 {
				position: relative;
				width: 100%;
				.name,
				.sign {
					font-size: 16px;
					display: inline-block;
					height: 24px;
					line-height: 24px;
					color: #FFFFFF;
				}
				.sign {
					padding: 0 10px;
					line-height: 20px;
					height: 20px;
					margin-left: 10px;
					background-color: #FEC008;
					border-radius: 5px;
					font-size: 12px;
					font-weight: bold;
					font-style: italic;
				}
				.userSet {
					position: absolute;
					right: 20px;
					color: #FFFFFF;
					font-size: 14px;
				}
			}
			.line2 {
				width: 100%;
				height: 26px;
				font-size: 12px;
				color: #FFFFFF;
				text{
					display: block;
				}
			}
		}
	}
	.choice,
	.userServers {
		width: calc(100% - 40px);
		background-color: #FFFFFF;
		box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
		margin: -20px 20px 0 20px;
		padding: 10px 20px;
		border-radius: 10px;
		z-index: 2;
		.msg {
			height: 40px;
			width: 100%;
		    border-bottom: 1px solid #999999;
		    margin-bottom: 25px;
			font-size: 18px;
			color: #666666;
			line-height: 40px;
		}
		.choiceItem {
			position: relative;
			display: flex;
			justify-content: space-around;
			width: 100%;
			height: 80px;
			.item {
				height: 80px;
				.img {
					width: 35px;
					height: 35px;
				}
				text{
					display: block;
					width: 35x;
					text-align: center;
					font-size: 14px;
					color: #666666;
				}
			}
		}
		
	}
	.userServers {
		margin-top: 20px;
		.servers {
			position: relative;
			width: 100%;
			height: 50px;
			.serversName {
				line-height: 50px;
				font-size: 14px;
			}
			.arror_right {
				position: absolute;
				right: 0;
				font-size: 12px;
				color: #999999;
				line-height: 50px;
			}
			
		}
	}
</style>
