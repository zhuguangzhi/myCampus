<template>
	<image class="ball" :src="setImgSrc" @click="clickBall()"></image>
</template>
	
<script>
	export default {
		name:"Ball",
		props:{
			imgType:{
				type:String,
				default:"statistics"
			}
		},
		computed:{
			setImgSrc(){
				if(this.imgType === "statistics"){
					return "../static/img/iconfont/statistics.svg"
				}else{
					return "../static/img/iconfont/add.svg"
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
		right: 40px;
		bottom: 160px;
		width: 50px;
		height: 50px;
		border-radius: 50px;
		border: 5px solid var(--color);
		padding: 6px;
		box-sizing: border-box;
	}
</style>
