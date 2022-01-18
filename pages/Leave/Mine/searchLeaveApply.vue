<template>
	<view class="leave">
		<LeaveList 
			ref="LeaveList"
			:leaveList.sync="applyLeaveLeat" 
			:currentPage="currentPage"
			@refresh="refresh"
			@loadMore="loadMore"
			@choseRadio='choseRadio'
		>
			<text class="btnText" @click="approveLeave(0)">拒绝</text> |
			<text class="btnText" @click="approveLeave(1)">同意</text>
		</LeaveList>
	</view>
</template>

<script>
	import leaveServer from '@/public/api/leave.js'
	import  { showLoading,getStorage,message }  from '@/public/common/baseFn.js'
	import {hToD} from '@/public/common/time.js'
	import LeaveList from '../component/teacher/leaveList.vue'
	export default {
		components:{
			LeaveList
		},
		data() {
			return {
				applyLeaveLeat:[],
				currentPage:1,
				totalPages:1,
				choseArr:[],
			}
		},
		created() {
			showLoading();
			this.getApplyList()
		},
		methods: {
			async getApplyList(){
				let [err,res] = await leaveServer.getStudentsLeaveList(this.currentPage);
				uni.hideLoading();
				if(!this.$http.errorCheck(err,res)) return false;
				let data = res.data.data;
				data.data.forEach((item)=>{
					// 添加radio属性
					item['radio'] = false
					item['marks'] = ''
					// 将后台传递的小时数转年月日时
					item.leave_time = hToD(item.leave_time);
					this.applyLeaveLeat.push(item)
				})
				this.$nextTick(()=>{
					this.$refs.LeaveList.close(data.data.length, data.total)
				})
				
			},
			// 下拉刷新
			async refresh(){
				this.applyLeaveLeat=[];
				this.currentPage = 1;
				await this.getApplyList()
			},
			// 上拉加载
			loadMore(){
				this.currentPage+=1;
				this.getApplyList()
			},
			// 全选
			choseRadio(data){
				this.choseArr = data
			},
			// 批假
			async approveLeave(result){
				if(this.choseArr.length===0){
					message('请至少选择一条请假单');
					return false;
				}
				let option = {
					title:"审批确认",
					content:"此操作不可逆,请是否确认",
					showCancel:true
				}
				let [modelErr,modelRes] =await uni.showModal(option);
				if(modelRes.cancel === true) return false;
				showLoading('批假中...');
				this.choseArr.sort().reverse();
				
				for (let item of this.choseArr) {
					let [err,res] = await leaveServer.approveLeave({
						'marks' : this.applyLeaveLeat[item].marks,
						'id' : this.applyLeaveLeat[item].id,
						'approveResult' : result
					})
					uni.hideLoading();
					if(!this.$http.errorCheck(err,res)) return;
					this.applyLeaveLeat.splice(item,1)
				}
				// 选中数组制空
				this.choseArr=[]
			},
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.leave {
		width: 100vw;
		min-height: 100vh;
		box-sizing: border-box;
	
	}
	.btnText {
		display: inline-block;
		flex: 1;
		width: 49%;
		height: 100%;
	}
</style>
