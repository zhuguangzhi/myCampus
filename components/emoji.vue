<template>
	<scroll-view @click.stop="" class="emojiStyle" :class="useEmoji?'openEmoji':'closeEmoji'" scroll-y="true" >
		<view v-for="(list,index) in pngUrlList" :key='index'>
			<image v-for="(item,key) in list" :key="key" @click="choseEmoji(item,index,key)" :src="item" ></image>
		</view>
	</scroll-view>
</template>

<script>
	import {pngUrl,pngList} from '@/public/config/emoji.js'
	export default {
		name:"emoji",
		props:{
			useEmoji:false
		},
		data() {
			return {
				pngUrlList:[]
			};
		},
		created() {
			this.pngUrlList = pngUrl()
		},
		methods:{
			// 选择表情
			choseEmoji(item,lineIndex,columnIndex){
				
				let choseEmojiIndex = `[$/${pngList[lineIndex][columnIndex]}]`
				this.$emit('choseEmoji',item,choseEmojiIndex)
			},
		}
	}
</script>

<style lang="less" scoped>
.emojiStyle {
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: #FFFFFF;
	z-index: 2;
	// 表情
	view {
		display: flex;
		justify-content: space-evenly;
		image {
			padding: 20rpx 0;
			width: 60rpx;
			height: 60rpx;
		}
	}
}
.openEmoji {
	height: 500rpx;
	transition: 0.15s linear;
}
.closeEmoji {
	height: 0;
	transition: 0.15s linear;
}
</style>
