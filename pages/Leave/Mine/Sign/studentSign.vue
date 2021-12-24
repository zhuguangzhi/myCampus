<template>
	<view class="studentSign">
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
				<text>软件工程导论</text>
			</view>
		</view>
		<button class="btn" type="default">签到</button>
	</view>
</template>

<script>
	import {getreverseGeocode} from '@/public/common/baseFn.js'
	export default {
		data() {
			return {
				latitude:'',
				longitude:'',
				address:'位置获取中...'
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
