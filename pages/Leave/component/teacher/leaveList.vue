<template>
	<view v-if="leaveList.length>0" class="leave">
		<mescroll-uni
			@init="mescrollInit"
			@up="loadMore" 
			@down="refresh" 
			:down="downOption" 
			:up="upOption" 
			height="92%"
			BGC="#F1F6F9"
		>
			<view class="box" v-for="(item,index) in leaveList" :key="index">
				<radio class="radio" :checked="item.radio" @click="isCheck(index)" />
				<view class="leaveHead">
					<text class="point" :style="{backgroundColor: item.leave_type==='病假'?'red':'#F3A44D'}"></text>
					<text class="LeaveType" >{{item.leave_type}}</text>
					<text class="leaveTime">{{item.create_time}}</text>
				</view>
				<!-- 请假学生 -->
				<view class="studentInfo">
					<image src="@/static/img/iconfont/leaveStudent.svg" class="icon imageSize"></image>
					<text class="studentName ">{{item.student_list.name}}</text>
					<text class="className">{{item.student_list.class_list.abbreviation}}</text>
				</view>
				<!-- 请假地点 -->
				<view class="toPlace">
					<image src="@/static/img/iconfont/toPlace.svg" class="icon imageSize"></image>
					<text class="studentName ">{{item.to_place}}</text>
				</view>
				<!-- 请假原因 -->
				<view class="leaveReason">
					<image src="@/static/img/iconfont/leaveReason.svg" class="icon imageSize"></image>
					<text class="reason">{{item.leave_reason}}</text>
				</view>
				<!-- 往返时间 -->
				<view class="timeSlot">
					<text>{{item.startTime}} - {{item.endTime}}</text>
					<text>{{item.leave_time}}</text>
				</view>
				<input v-if="item.marks!=null" style="isplay: block;margin-top: 10px;" 
				type="text" v-model="item.marks" placeholder="批注" />
			</view>
			
		</mescroll-uni>
		<view class="bottomBua">
			<radio :checked="choseAllRadio" @click="choseAll()" />
			<text>全选</text>
			<view class="btn">
				<slot></slot>
			</view>
		</view>
	</view>
	<mescroll-empty v-else></mescroll-empty>
	<!-- <nothing msg="暂无审批" v-else/> -->
</template>

<script>
	import nothing from '@/components/nothing.vue'
	export default {
		components:{
			nothing
		},
		props:{
			leaveList:Array,
			currentPage:Number,
			useDownRefresh:{
				type:Boolean,
				default:true
			}
			
		},
		data() {
			return {
				choseAllRadio:false,
				// 所选择Radio
				choseArr:[],
				downOption:{
					use:this.useDownRefresh,
					auto:false,
				},
				upOption:{
					use:this.useDownRefresh,
					auto:false,
					isBounce:true,
					page:{num:this.currentPage,size:10},
					isBounce:true,
				},
				mescroll:null
			}
		},
		watch:{
			choseArr(val){
				if(val.length === this.leaveList.length && val.length!==0){
					this.choseAllRadio=true
				}else {
					this.choseAllRadio=false
				}
				this.$emit('choseRadio',this.choseArr)
			}
		},
		methods: {
			mescrollInit(e){
				// console.log('------------',e)
				this.mescroll = e
			},
			isCheck(index){
				if(this.leaveList[index].radio){
					// 取消选择
					let currentIndex = this.choseArr.indexOf(index);
					this.choseArr.splice(currentIndex,1)
				}else {
					// 选择
					this.choseArr.push(index)
				}
				this.leaveList[index].radio = !this.leaveList[index].radio
				this.$emit('update:leaveList',this.leaveList)
			},
			// 下拉刷新
			refresh(){
				this.choseArr=[]
				this.choseAllRadio=false
				this.$emit('refresh')
			},
			// 上拉加载
			loadMore(){
				this.$emit('loadMore')
			},
			// 全选
			choseAll(){
				if(this.choseAllRadio){
					// 全不选
					this.leaveList.forEach(item=>{
						item.radio = false
					})
					this.choseArr=[]
					this.choseAllRadio=false
				}else{
					this.choseArr=[]
					this.leaveList.forEach((item,index)=>{
						this.choseArr.push(index)
						item.radio = true
					})
					this.choseAllRadio=true
				}
				this.$emit('update:leaveList',this.leaveList)
			},
			close(dataSize, totalSize){
				this.mescroll.endBySize(dataSize, totalSize);
			}
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
	.box{
		position: relative;
		width: calc(100vw - 30px);
		box-sizing: border-box;
		margin: 20px 15px 0 15px;
		border-radius: 10px;
		background-color: #FFFFFF;
		padding: 20px 10px;
		.radio {
			position: absolute;
			width: 25px;
			height: 25px;
			top: -12px;
			right: -7px;
		}
	}
	.leaveHead {
		position: relative;
		height: 30px;
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
		.leaveTime{
			position: absolute;
			height: 30px;
			line-height: 30px;
			right: 10px;
			display: inline-block;
			font-size: 14px;
			color: #999999;
		}
	}
	.studentInfo,
	.toPlace,
	.leaveReason{
		padding: 10px 5px;
	}
	.studentName {
		font-size: 16px;
		display: inline-block;
		margin-right: 10px;
	}
	.className {
		font-size: 14px;
		color: #666666;
	}
	.imageSize {
		width: 20px;
		height: 20px;
	}
	.leaveReason {
		display: flex;
		justify-content: space-around;
	}
	.reason {
		flex: 1;
		font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.timeSlot {
		position: relative;
		width: 100%;
		height: 40px;
		border: 1px solid #999999;
		border-radius: 40px;
		box-sizing: border-box;
		line-height: 40px;
		padding: 0 10px;
		text:last-child {
			display: inline-block;
			position: absolute;
			right: 10px;
			height: 40px;
			color: #999999;
		}
	}
	.bottomBua {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 8%;
		box-sizing: border-box;
		border:1px solid #eeeeee;
		background-color: #FFFFFF;
		padding: 0 10px;
		.btn {
			position: absolute;
			right: 10px;
			width: 160px;
			height: 40px;
			border-radius: 40px;
			background-color: var(--color);
			color: #FFFFFF;
			font-size: 16px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			line-height: 40px;
			text-align: center;
		}
	}
</style>
