<template>
	<view class="searchLeaveInfo">
		<!-- <tabControl 
			:current="1" 
			:lineWidth="70" 
			:values="tabBars" 
			bgc="#fff" :fixed="false" 
			:scrollFlag="true" 
			:isEqually="false" 
			@clickItem="ontabtap">
		</tabControl> -->
	</view>
</template>

<script>
	export default {
		name:'searchLeaveInfo',
		data(){
			return{
				tabBars:['请假状态','历史记录']
			}
		}
	}
</script>

<style lang="less" scoped>
	.searchLeaveInfo {
		width: 100vw;
		
	}
</style>
