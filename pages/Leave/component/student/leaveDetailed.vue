<template>
	<view class="toLeave">
		<leave-item
			v-if="leaveInfo"
			:form = "leaveInfo"
			:showStartTime = "leaveInfo.startTime"
			:showEndTime = "leaveInfo.endTime"
			:showLeaveTime = "leaveInfo.leave_time"
			:disabled = 'true'
		></leave-item>
	</view>
</template>

<script>
	import leaveItem from "../LeaveItem.vue"
	import leaveServe from '@/public/api/leave.js'
	import  { showLoading }  from '@/public/common/baseFn.js'
	import {hToD} from '@/public/common/time.js'
	import UserConfig from '@/public/config/user.js'
	export default {
		components:{
			leaveItem
		},
		onLoad(options) {
			showLoading('信息获取中');
			this.getLeaveInfo(options.id)
		},
		data() {
			return {
				leaveInfo:null,
			};
		},
		methods:{
			async getLeaveInfo(id){
				let [err,res] = await leaveServe.getLeaveInfo(id);
				if(!this.$http.errorCheck(err,res)) return false;
				let data = res.data.data
				let userInfo = UserConfig.userInfo;
				data.leave_time = hToD(data.leave_time);
				this.leaveInfo = data;
				uni.hideLoading();
			},
			
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
.toLeave {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 0 20px;
}
.toLeave::after{
	content: '';
	position: absolute;
	top: 0;
	left: -20px;
	width: calc(100% + 40px);
	height: 110px;
	background-color: var(--color);
}

</style>
