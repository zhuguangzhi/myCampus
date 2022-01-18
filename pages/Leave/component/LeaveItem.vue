<template>
	<view>
		<view class="card" @click="LeaveType()">
			<text class="point" style="background-color: #E75754;"></text>
			<text class="LeaveType">请假类别</text>
			<text class="showMsg">{{form.leave_type}}</text>
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
				style="width: 100%;"
				v-model="form.to_place" 
				placeholder-style="color:#999999;font-size:14px"
				maxlength="15"
				:disabled="disabled"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #3AAF56;"></text>
			<text class="LeaveType">请假事由</text>
			<textarea 
				v-model="form.leave_reason"
				maxlength="140" 
				auto-height 
				placeholder-style="color:#999999;font-size:14px"
				placeholder="说点啥吧~"
				:show-confirm-bar="false" 
				disable-default-padding="true"
				class="reason"
				:disabled="disabled"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #E75754;"></text>
			<text class="LeaveType">联系电话</text>
			<input 
				class="mobileStyle"
				type="text" 
				v-model="form.student_mobile" 
				placeholder-style="color:#999999;font-size:14px"
				maxlength="11"
				:disabled="disabled"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #F49F44;"></text>
			<text class="LeaveType">家长联系电话</text>
			<input
				class="mobileStyle"
				type="text" 
				v-model="form.parent_mobile" 
				placeholder-style="color:#999999;font-size:14px"
				maxlength="11"
				:disabled="disabled"
			/>
		</view>
		<view class="card">
			<text class="point" style="background-color: #3AAF56;"></text>
			<text class="LeaveType">当前审批人</text>
			<text class="showMsg">{{form.teacher_list.name}}</text>
		</view>
		<view class="btn" v-if="!disabled">
			<text @click="saveSecretary()">保存为草稿</text>
			<text @tap="requestSubscribe()">提交</text>
		</view>
		<view v-else>
			<view class="card">
				<text class="point" style="background-color: #F49F44;"></text>
				<text class="LeaveType">审批备注</text>
				<textarea
					v-model="form.refuse_reason"
					maxlength="140" 
					auto-height 
					:show-confirm-bar="false" 
					disable-default-padding="true"
					class="reason"
					:disabled="disabled"
				/>
				
			</view>
			<text class="result" 
				:style="{color: leaveResult(form.is_pass)['color']}">
					{{leaveResult(form.is_pass)['msg']}}
			</text>
		</view>
	</view>
</template>

<script>
	import baseConfig from '@/public/config/BaseConfig.js'
	export default {
		props:{
			disabled:{
				type:Boolean,
				default:false
			},
			form:Object,
			showStartTime: String,
			showEndTime: String,
			showLeaveTime: String,
		},
		methods:{
			// 展示时间表
			showPicker(ref){
				if(!this.disabled)
				this.$emit('showPicker',ref)
			},
			// 请假类型
			LeaveType(){
				if(!this.disabled)
				this.$emit('LeaveType')
			},
			// 保存草稿
			saveSecretary(){
				if(!this.disabled)
				this.$emit('saveSecretary',this.form)
			},
			// 提交
			submitLeave(){
				if(!this.disabled)
				this.$emit('submitLeave',this.form)
			},
			// 请假结果
			leaveResult(data){
				let res={};
				switch(data){
					case 0:
						res.msg = "拒绝";
						res.color = "red";
						break;
					case 1:
						res.msg = "同意";
						res.color ="#174B89"
						break;
					case 2:
						res.msg = "审批中";
						res.color = "#F3A44D"
						break;
				}
				return res;
			},
			// 审批结果订阅
			async requestSubscribe(){
				await uni.requestSubscribeMessage({
					tmplIds:baseConfig.subscribeLeaveResult,
					success:(res)=>{
						this.submitLeave();
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
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
	.result {
		display: block;
		position: absolute;
		right: 30px;
		font-size: 20px;
	}
</style>
