<template>
	<image class="ball" :src="setImgSrc" @click="clickBall()"></image>
</template>
	
<script>
	export default {
		name:"Ball",
		props:{
			imgType:{
				type:String,
				default:"add"
			}
		},
		computed:{
			setImgSrc(){
				if(this.imgType === "statistics"){
					return "/static/img/iconfont/statistics.svg"
				}else{
					return "/static/img/iconfont/add.svg"
				}
			}
		},
		methods: {
			clickBall(){
				this.$emit('tapBall');
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.ball {
		position: fixed;
		left: 20rpx;
		bottom: 160rpx;
		width: 50px;
		height: 50px;
		border-radius: 50px;
		border: 5px solid var(--color);
		padding: 6px;
		box-sizing: border-box;
		background-color: #FFFFFF;
		z-index: 5;
	}
</style>
