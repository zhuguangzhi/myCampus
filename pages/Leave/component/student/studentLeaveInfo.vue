<template>
	<view class="studentLeaveInfo" v-if="!openNothing">
		<loadRefresh
			ref="loadRefresh"
			:isRefresh="true"
			refreshType="halfCircle"
			color="#174B89"
			:heightReduce="statusHeight"
			:currentPage="currentPage"
			:totalPages="totalPages" 
			@loadMore="loadMore" 
			@refresh="refresh"
		>
			<view class="card" slot="content-list" v-for="(item,index) in leaveList" :key="index" @click="toLeaveInfo(item.id)">
				<text class="point" :style="{backgroundColor: item.leave_type==='病假'?'red':'#F3A44D'}"></text>
				<text class="LeaveType">{{item.leave_type}}</text>
				<view class="timeSlot">
					<view class="content">
						<text>{{item.startTime}} - {{item.endTime}}</text>
						<text>{{item.leave_time}}</text>
					</view>
					<view class="content">
						<text class="leaveTime">申请时间：{{item.create_time}}</text>
						<text class="result" :style="{color: leaveResult(item.is_pass)['color']}">{{leaveResult(item.is_pass)['msg']}}</text>
					</view>
						
				</view>
			</view>
		</loadRefresh>
	</view>
	<nothing msg="暂无请假记录" v-else/>
</template>

<script>
	import loadRefresh from '@/components/uniapp/load-refresh/load-refresh.vue'
	import leaveServer from '@/public/api/leave.js'
	import  { getStorage,toPage,showLoading }  from '@/public/common/baseFn.js'
	import {hToD} from '@/public/common/time.js'
	// 缺省页
	import nothing from '@/components/nothing.vue'
	export default {
		name:'studentLeaveInfo',
		components:{
			loadRefresh,
			nothing
		},
		data(){
			return{
				currentPage:1,
				totalPages:1,
				leaveList:[],
				// 状态栏高度
				statusHeight:null,
				openNothing:false
			}
		},
		created() {
			this.statusHeight = getStorage('systemStatusHeight')
			// showLoading();
			this.getLeaveData()
		},
		methods:{
			// 获取请假信息
			async getLeaveData(){
				let [err,res] = await leaveServer.getLeaveList(this.currentPage);
				if(!this.$http.errorCheck(err,res)) return false;
				let data = res.data.data;
				// 设置总页数
				this.totalPages = data.total;
				data.data.forEach((item)=>{
					// 将后台传递的小时数转年月日时
					item.leave_time = hToD(item.leave_time);
					this.leaveList.push(item);
				})
				// 关闭下拉动画
				this.$refs.loadRefresh.completed();
				if(data.data.length===0){
					this.openNothing = true;
				}else {
					this.openNothing = false;
				}
				
				uni.hideLoading()
				
			},
			// 下拉刷新
			refresh(){
				this.leaveList=[];
				this.currentPage = 1;
				this.getLeaveData()
			},
			// 上拉加载
			loadMore(){
				this.currentPage+=1;
				this.getLeaveData()
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
			//去请假信息页
			 toLeaveInfo(id){
				 toPage(`/pages/Leave/component/student/leaveDetailed?id=${id}`)
			 },
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.studentLeaveInfo {
		box-sizing: border-box;
		width: 100vw;
	}
	.card {
		position: relative;
		left: 20px;
		width: calc(100vw - 40px);
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
			font-size: 20px;
		}
	}
	.timeSlot {
		position: relative;
		top: 10px;
		left: 20px;
		.content{
			display: block;
			font-size: 16px;
			height: 40px;
			line-height: 40px;
			text-align: left;
			text{
				display: inline-block;
				margin-right: 15px;
			}
			.leaveTime{
				font-size: 14px;
				color: #999999;
			}
			.result {
				position: absolute;
				right: 10px;
				font-size: 20px;
			}
		}
		
	}
	
</style>
