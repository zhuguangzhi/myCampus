<template>
	<view class="course" v-if="signList.length>0">
		<view class="subtitle">
			{{title}}
		</view>
		<view class="boxList" v-for="(item,index) in signList" :key="index">
			<text>{{item.course.course_name}}</text>
			<text>{{item.invalid_time}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"courseSignList",
		props:{
			signList:Array,
			title:String
		},
	}
</script>

<style scoped lang="less">
	.course {
		padding: 10px;
		border-bottom: 1px solid #EEEEEE;
		border-radius: 10px;
		margin-bottom: 10px;
	}
	.subtitle {
		font-size: 16px;
		padding-bottom: 10px;
	}
	.boxList {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: #999999;
	}
</style>
