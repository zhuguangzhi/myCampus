<template>
	<view class="toLeave">
		<leave-item 
			@showPicker = "showPicker" 
			@LeaveType = "LeaveType"
			@submitLeave = "submitLeave"
			@saveSecretary = "saveSecretary"
			:form = "form"
			:showStartTime = "showStartTime"
			:showEndTime = "showEndTime"
			:showLeaveTime = "showLeaveTime"
		></leave-item>
		<xp-picker ref="startLeave" @confirm="startLeave()" :year-range="computedYear" mode="ymdh"></xp-picker>
		<xp-picker ref="endLeave" @confirm="endLeave()" :year-range="computedYear" mode="ymdh"></xp-picker>
	</view>
</template>

<script>
	// api
	import {timediff} from '@/public/common/time.js'
	import {message,setStorage,getStorage,delStorage,toPage} from '@/public/common/baseFn.js'
	import UserConfig from '@/public/config/user.js'
	import LeaveServers from '@/public/api/leave.js';
	// 组件
	import xpPicker from '@/components/uniapp/xp-picker/xp-picker.vue'
	import leaveItem from "../component/LeaveItem.vue"
	export default {
		data() {
			return {
				leaveTypeList:['事假','病假','考试','其他'],
				showStartTime:'',
				showEndTime:'',
				showLeaveTime:'',
				form:{
					// 请假类别
					leave_type:'事假',
					// 请假事由
					leave_reason:'',
					student_mobile:'18720427542',
					parent_mobile:'15949550963',
					// 开始请假时间
					startTime:'',
					// 结束请假
					endTime:'',
					// 请假地点
					to_place:'',
					leave_time:'',
					// 一级批假人
					headmasterName:'',
				}
			};
		},
		components:{
			xpPicker,
			leaveItem
		},
		created(){
			let userInfo = UserConfig.userInfo;
			// 获取草稿
			let secretary = getStorage('secretary');
			if(secretary){
				this.form = secretary;
				return false;
			}
			this.form.headmasterName = userInfo.class_list.headmaster.name
		},
		computed:{
			computedYear(){
				let currentYear = new Date().getFullYear();
				return [currentYear,currentYear+1];
			}
		},
		methods:{
			// 请假类别
			LeaveType(){
				uni.showActionSheet({
				    itemList: this.leaveTypeList,
				    success: (res)=> {
						this.form.leave_type=this.leaveTypeList[res.tapIndex];
				    }
				});
			},
			// 展示picker
			showPicker(ref){
				this.$refs[ref].show()
			},
			// 开始请假时间
			startLeave(e){
				let time = e.value
				this.form.startTime = e.timestamp
				time=time.replace(':00:00','')
				this.showStartTime=time+'时'
				this.leaveTime()
				
			},
			// 结束请假时间
			endLeave(e){
				let time = e.value
				time=time.replace(':00:00','')
				this.showEndTime=time+'时'
				this.form.endTime = e.timestamp
				this.leaveTime()
			},
			// 计算请假时间
			leaveTime(){
				let endTime = this.form.endTime
				let startTime = this.form.startTime
				if (!endTime || !startTime) return false
				// 获取当前时间
				let currentTime = new Date().getTime();
				// 判断请假时间是否是之前或现在
				if ((endTime<=currentTime || startTime <= currentTime) || (endTime <= startTime)){
					message('时间错误',3000);
					this.form.endTime=''
					this.form.startTime=''
					this.showEndTime=''
					this.showStartTime=''
					return false
				}
				// 小时转年月日
				let[res,hourse] = timediff(Number(startTime) , Number(endTime));
				this.showLeaveTime=res;
				this.form.leave_time = hourse;
			},
			// 保存草稿
			saveSecretary(form){
				setStorage('secretary',form);
				message('保存成功');
			},
			// 提交申请
			async submitLeave(form){
				let [err,res] = await LeaveServers.applyLeave(form);
				if(!this.$http.errorCheck(err,res)) return false;
				delStorage('secretary')
				toPage('/pages/Leave/Leave','switchTab');
				message('请假成功',3000);
			}
			
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
