<template>
	<view class="studentSign" v-if="course.courseName">
		<view class="signTip">
			<h2 class="title">签到须知</h2>
			<ul class="list">
				<li>• 请确保手机打开了GPS</li>
				<li>• 请在右上角设置中允许获取定位权限</li>
				<li>• 须保证您现在的位置在教室内</li>
			</ul>
		</view>
		<view class="signMsg">
			<view class="line ">
				<image class="icon" src="@/static/img/iconfont/address.svg"></image>
				<text class="address">
					{{address}}
				</text>
				<map class="map"
					id="map" 
					:latitude="latitude" 
					:longitude="longitude"
					scale="18"
					show-location
				>
				</map>
			</view>
			<view class="line">
				<image class="icon" src="@/static/img/iconfont/curriculum.svg"></image>
				<text>{{course.courseName}}</text>
			</view>
		</view>
		<button class="btn" type="default" @click="toSign()">签到</button>
	</view>
	<nothing v-else msg="暂无教师发布签到"/>
</template>

<script>
	import {getreverseGeocode,showLoading,toPage} from '@/public/common/baseFn.js'
	import nothing from '@/components/nothing.vue'
	import CourseServer from '@/public/api/course.js'
	import websocketUtil from '@/public/common/socket.js'
	export default {
		components:{
			nothing
		},
		data() {
			return {
				latitude:'',
				longitude:'',
				address:'位置获取中...',
				course:{},//签到的课程名
				webSocket:null,
			}
		},
		created() {
			this.getLocation();
			showLoading('签到获取中...')
			this.getCourse();
			// 连接socket
			this.webSocket = new websocketUtil()
		},
		onLoad() {
			let map = uni.createMapContext('map',this);
			setInterval(()=>{
				map.moveToLocation()
			},3000)
		},
		onHide() {
			this.webSocket.close();
		},
		methods: {
			//获取用户地理位置
			async getLocation(){
				await uni.getLocation({
				    type: 'gcj02',
					altitude:true,
				    success: (res)=> {
				       this.latitude = res.latitude;
					   this.longitude = res.longitude;
					   getreverseGeocode(res.longitude,res.latitude,this)

				    },
					fail:()=>{
						// 定位权限未开启，引导设置
						uni.showModal({
							title: '温馨提示',
							content: '您已拒绝定位,请开启',
							confirmText: '去设置',
							success:(res)=> {
								if (res.confirm) {
									//打开授权设置
									uni.openSetting({
										success:()=> {
											this.getLocation()
										}
									})
								}
							}
						})
					}
				});
			},
			// 获取签到课程信息
			async getCourse(){
				let [err,res] = await CourseServer.getStudensSignList();
				uni.hideLoading();
				if(!this.$http.errorCheck(err,res)) return false
				this.course = res.data.data
			},
			// 签到
			async toSign(){
				showLoading('签到中...')
				let [err,res] = await CourseServer.studentSign(
					this.course.signId,
					this.course.teacherId,
					this.address,
					this.latitude,
					this.longitude
				);
				uni.hideLoading();
				if(!this.$http.errorCheck(err,res)) return;
				toPage('/pages/Leave/Leave','switchTab');
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.studentSign {
		width: 100vw;
		box-sizing: border-box;
		padding: 0 15px;
	}
	.map {
		width: 100%;
		height: 250px;
		margin: 20px 0 0 0;
	}
	.signTip {
		width: 100%;
		margin-top: 30px;
		.title {
			display: block;
			height: 40px;
			line-height: 40px;
		}
		.list {
			font-size: 14px;
			color: #999999;
			line-height: 35px;
			li {
				list-style-type: disc!important;
			}
		}
	}
	.signMsg {
		width: 100%;
		margin-top: 10px;
		.line {
			padding: 20px 0;
			border-bottom: 1px solid #999999;
			.address {
				display: inline-block;
				width: calc(100% - 35px);
				
			}
		}
	}
	.btn {
		width: 100%;
		height: 40px;
		border-radius: 5px;
		border:1px solid var(--color);
		font-size: 16px;
		color: var(--color);
		line-height: 40px;
		margin-top: 40px;
		background-color: #FFFFFF;
		text-align: center;
	}
</style>
