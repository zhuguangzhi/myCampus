<template>
	<view class="toLeave">
		<view class="card" @click="LeaveType()">
			<text class="point" style="background-color: #E75754;"></text>
			<text class="LeaveType">请假类别</text>
			<text class="showMsg">{{form.leaveType}}</text>
		</view>
		<view class="card">
			<view style="padding-bottom: 10px;" @click="showPicker('startLeave')">
				<text class="point" style="background-color: #F49F44;"></text>
				<text class="LeaveType">开始时间</text>
				<text class="showMsg">{{showStartTime}}</text>
			</view>
			<view style="padding-top: 10px;" @click="showPicker('endLeave')">
				<text class="point" style="background-color: #3AAF56;"></text>
				<text class="LeaveType">结束时间</text>
				<text class="showMsg">{{showEndTime}}</text>
			</view>
		</view>
		<view class="card">
			<text class="point" style="background-color: #E75754;"></text>
			<text class="LeaveType">请假时长</text>
			<text class="showMsg">{{showLeaveTime}}</text>
		</view>
		<view class="card">
			<text class="point" style="background-color: #F49F44;"></text>
			<text class="LeaveType">去往地点</text>
			<input
				class="mobileStyle"
				type="text" 
				v-model="form.place" 
				placeholder-style="color:#999999;font-size:14px"
				maxlength="15"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #3AAF56;"></text>
			<text class="LeaveType">请假事由</text>
			<textarea 
				v-model="form.leaveReason"
				maxlength="140" 
				auto-height 
				placeholder-style="color:#999999;font-size:14px"
				placeholder="说点啥吧~"
				:show-confirm-bar="false" 
				disable-default-padding="true"
				class="reason"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #E75754;"></text>
			<text class="LeaveType">联系电话</text>
			<input 
				class="mobileStyle"
				type="text" 
				v-model="form.mobile" 
				placeholder-style="color:#999999;font-size:14px"
				maxlength="11"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #F49F44;"></text>
			<text class="LeaveType">家长联系电话</text>
			<input
				class="mobileStyle"
				type="text" 
				v-model="form.parentMobile" 
				placeholder-style="color:#999999;font-size:14px"
				maxlength="11"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #3AAF56;"></text>
			<text class="LeaveType">审批人</text>
			<text class="showMsg">{{userInfo.class_list.headmaster.name}}</text>
		</view>
		<view class="btn">
			<text @click="saveSecretary()">保存为草稿</text>
			<text @click="submitLeave()">提交</text>
		</view>
		<xp-picker ref="startLeave" @confirm="startLeave()" :year-range="computedYear" mode="ymdh"></xp-picker>
		<xp-picker ref="endLeave" @confirm="endLeave()" :year-range="computedYear" mode="ymdh"></xp-picker>
	</view>
</template>

<script>
	import xpPicker from '@/components/uniapp/xp-picker/xp-picker.vue'
	import {timediff} from '@/public/common/time.js'
	import {message,setStorage,getStorage,delStorage,toPage} from '@/public/common/baseFn.js'
	import UserConfig from '@/public/config/user.js'
	import LeaveServers from '@/public/api/leave.js';
	export default {
		data() {
			return {
				userInfo:null,
				leaveTypeList:['事假','病假','考试','其他'],
				showStartTime:'',
				showEndTime:'',
				showLeaveTime:'',
				form:{
					// 请假类别
					leaveType:'事假',
					// 请假事由
					leaveReason:'',
					mobile:'18720427542',
					parentMobile:'15949550963',
					// 开始请假时间
					startTime:'',
					// 结束请假
					endTime:'',
					// 请假地点
					place:'',
					leaveHours:'',
				}
			};
		},
		components:{
			xpPicker
		},
		created(){
			this.userInfo = UserConfig.userInfo;
			let secretary = getStorage('secretary');
			if(secretary){ 
				this.form = secretary;
				return false;
			}
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
						this.form.leaveType=this.leaveTypeList[res.tapIndex];
				    }
				});
			},
			// 展示picker
			showPicker(ref){
				this.$refs[ref].show()
			},
			// 开始请假
			startLeave(e){
				let time = e.value
				this.form.startTime = e.timestamp
				time=time.replace(':00:00','')
				this.showStartTime=time+'时'
				this.leaveTime()
			},
			// 结束请假
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
				let currentTime = new Date().getTime();
				if ((endTime<=currentTime || startTime <= currentTime) || (endTime === startTime)){
					message('时间错误',3000);
					this.form.endTime=''
					this.form.startTime=''
					this.showEndTime=''
					this.showStartTime=''
					return false
				}
				let[res,hourse] = timediff(Number(startTime) , Number(endTime));
				this.showLeaveTime=res;
				this.form.leaveHours = hourse;
			},
			// 保存草稿
			saveSecretary(){
				setStorage('secretary',this.form);
				message('保存成功');
			},
			// 提交申请
			async submitLeave(){
				let [err,res] = await LeaveServers.applyLeave(this.form);
				if(!this.$http.errorCheck(err,res)) return false;
				delStorage('secretary')
				toPage('/pages/Leave/Leave','switchTab');
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
.card {
	position: relative;
	width: 100%;
	padding: 15px 10px;
	box-sizing: border-box;
	margin: 20px 0;
	border-radius: 10px;
	background-color: #FFFFFF;
	box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.3);
	z-index: 2;
	.point {
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-right: 10px;
		border-radius: 10px;
	}
	.LeaveType {
		font-size: 16px;
	}
	.showMsg {
		position: absolute;
		right: 10px;
		font-size: 14px;
		color: #999999;
	}
	.reason {
		width: 100%;
		min-height: 30px;
		max-height: 80px;
		color: #999999;
		line-height: 10px;
		font-size: 14px;
		border: none;
	}
	.mobileStyle {
		position: absolute;
		right: 10px;
		display: inline-block;
		vertical-align: middle;
		text-align: right;
		color: #999999;
		font-size: 14px;
		border: none;
	}
}
.btn {
	width: 100%;
	display: flex;
	justify-content: space-around;
	color: #FFFFFF;
	font-size: 16px;
	font-weight: bold;
	margin: 40px 0 20px 0;
	text {
		display: inline-block;
		width: 45%;
		height: 50px;
		line-height: 50px;
		text-align: center;
		background-color: var(--color);
		border-radius: 50px;
	}
}

</style>
