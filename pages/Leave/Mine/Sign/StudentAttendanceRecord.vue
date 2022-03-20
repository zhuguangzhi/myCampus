<template>
	<view v-if="haveInfo">
		<nothing/>
	</view>
	<view v-else>
		<CourseSignList title="旷课记录" :signList="signList.absenteeismList"/>
		<CourseSignList title="迟到记录" :signList="signList.lateList"/>
		<CourseSignList title="请假记录" :signList="signList.leaveList"/>
		<CourseSignList title="早退记录" :signList="signList.leaveEarlyList"/>
	</view>
</template>

<script>
	import courseServers from '@/public/api/course.js'
	import {showLoading,message,showModel} from '@/public/common/baseFn.js'
	import CourseSignList from './components/courseSignList.vue'
	import nothing from '../../../../components/nothing.vue'
	export default {
		data() {
			return {
				signList:[],//考勤表
			};
		},
		components:{
			CourseSignList,
			nothing
		},
		created() {
			showLoading();
			this.$nextTick(()=>{
				this.getSignList()
			})
		},
		computed:{
			haveInfo(){
				let data = this.signList;
				console.log(data)
				if(data.absenteeismList && (data.absenteeismList.length>0 || data.lateList.length>0 || data.leaveList.length>0 ||data.leaveEarlyList.length>0))
				 return false
				return true
			}
		},
		methods:{
			// 获取考勤记录
			async getSignList(){
				let [err,res] = await courseServers.getSignList();
				uni.hideLoading()
				if(!this.$http.errorCheck(err,res)) return false;
				let data = res.data.data;
				this.signList = data.Statistics;
				console.log('-----------',this.signList)
			}
		}
	}
</script>

<style lang="less">

</style>
