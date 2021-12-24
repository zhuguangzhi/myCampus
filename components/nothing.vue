<template>
	<view class="content">
		<image src="@/static/img/nothing.png" mode="aspectFit"></image>
		<text class="msg">{{msg}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			msg:String
		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100vw;
		height: 100vh;
		background-color: #FFFFFF;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		image{
			position: relative;
			display: block;
			left: 15vw;
			top: 80px;
			width: 70vw;
		}
		.msg {
			display: block;
			width: 70vw;
			margin: 80px 0 0 15vw;
			text-align: center;
			font-size: 16px;
			color: #999999;
		}
	}
</style>
