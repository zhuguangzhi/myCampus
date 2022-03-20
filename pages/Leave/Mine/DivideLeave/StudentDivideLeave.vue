<template>
	<view class="studentSign" v-if="leaveList.length>0">
		<view class="signTip">
			<h2 class="title">销假须知</h2>
			<ul class="list">
				<li>• 请确保手机打开了GPS</li>
				<li>• 请在右上角设置中允许获取定位权限</li>
				<li>• 须保证您现在的位置在共青学院内</li>
				<li>• 定位错误请联系班主任代销</li>
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
				<image class="icon" src="/static/img/iconfont/leaveIcon.svg"></image>
				<text>在 {{leaveList[0].startTime}} 去往 {{leaveList[0].to_place}} 的记录</text>
			</view>
		</view>
		<button class="btn" type="default" @click="toSign()">销假</button>
		<Face v-if="checkFace" @checkResult="checkResult" :userId="userId"/>
	</view>
	<nothing v-else msg="现在不需要销假的哦~"/>
</template>

<script>
	import {getreverseGeocode,showLoading} from '@/public/common/baseFn.js'
	import nothing from '@/components/nothing.vue'
	import leaveServer from '@/public/api/leave.js'
	import Face from '@/components/Login/face.vue'
	export default {
		components:{
			nothing,
			Face
		},
		props:{
			leaveList:Array,
			userId:String
		},
		data() {
			return {
				latitude:'',
				longitude:'',
				address:'位置获取中...',
				checkFace:false,
			}
		},
		created() {
			this.getLocation();
		},
		onLoad() {
			let map = uni.createMapContext('map',this);
			setInterval(()=>{
				map.moveToLocation()
			},3000)
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
			// 销假
			toSign(){
				this.checkFace=true
				
			},
			async checkResult(res){
				this.checkFace=false
				if(res){
					showLoading('销假中...')
					let [err,res] = await leaveServer.divideLeave({
							'leaveId' : this.leaveList[0].id,
							'latitude':this.latitude,
							'longitude':this.longitude
						})
					uni.hideLoading();
					if(!this.$http.errorCheck(err,res)) return;
					// 返回到上一级路由
					uni.navigateBack();
				}
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
