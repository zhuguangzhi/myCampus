<template>
	<view>
		<StudentDivideLeave :leaveList.sync="leaveList" :userId="userInfo.userId" v-if="!userInfo.isTeacher" />
		<LeaveList
			v-else
			ref="LeaveList"
			:leaveList.sync="leaveList" 
			:currentPage="currentPage" 
			@refresh="refresh"
			@loadMore="loadMore"
			@choseRadio='choseRadio'
		>
			<text class="btnText" @click="divideLeave()">销假</text>
		</LeaveList>
	</view>
</template>

<script>
	import userConfig from '@/public/config/user.js'
	import LeaveList from '../../component/teacher/leaveList.vue'
	import leaveServer from '@/public/api/leave.js'
	import {showLoading,message} from '@/public/common/baseFn.js'
	import {hToD} from '@/public/common/time.js'
	import StudentDivideLeave from './StudentDivideLeave.vue'
	export default {
		components:{
			LeaveList,
			StudentDivideLeave
		},
		data() {
			return {
				userInfo:userConfig.userInfo,
				currentPage:1,
				choseArr:[],
				leaveList:[],
			};
		},
		created() {
			this.getDivideLeaveList()
		},
		methods:{
			//获取销假列表
			async getDivideLeaveList(){
				showLoading();
				let [err,res] = await leaveServer.getDivideLeave(this.currentPage)
				uni.hideLoading();
				if(!this.$http.errorCheck(err,res)) return false;
				let data = res.data.data;
				if(this.userInfo.isTeacher){
					if(data.data==null){
						return false;
					}
					data.data.forEach((item)=>{
						// 添加radio属性
						item['radio'] = false
						// 将后台传递的小时数转年月日时
						item.leave_time = hToD(item.leave_time);
						this.leaveList.push(item)
					})
					this.$nextTick(()=>{
						this.$refs.LeaveList.close(data.data.length, data.total)
					})
				}else {
					console.log(data)
					this.leaveList = data
				}
				
			},
			// 下拉刷新
			async refresh(){
				this.leaveList=[];
				this.currentPage = 1;
				await this.getDivideLeaveList()
			},
			// 上拉加载
			loadMore(){
				this.currentPage+=1;
				this.getDivideLeaveList()
			},
			// 全选
			choseRadio(data){
				this.choseArr = data
			},
			// 代批
			async divideLeave(){
				if(this.choseArr.length===0){
					message('请至少选择一条请假记录');
					return false;
				}
				let option = {
					title:"销假确认",
					content:"是否确认为选中的学生销假",
					showCancel:true
				}
				let [modelErr,modelRes] = await uni.showModal(option);
				if(modelRes.cancel === true) return false;
				showLoading('销假中...');
				this.choseArr.sort().reverse();
				
				for (let item of this.choseArr) {
					let [err,res] = await leaveServer.divideLeave({
						'leaveId' : this.leaveList[item].id,
					})
					this.$http.errorCheck(err,res)
					this.leaveList.splice(item,1)
				}
				// 选中数组制空
				this.choseArr=[]
				uni.hideLoading()
			}
			
		}
	}
</script>

<style lang="less" scoped>
	@import '/static/css/base.css';
	.teacher,
	.studens{
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		padding: 0 15px;
	}
	.btnText {
		display: inline-block;
		flex: 1;
		width: 49%;
		height: 100%;
		
	}
</style>
