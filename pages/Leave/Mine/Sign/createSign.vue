<template>
	<view class="sign" v-if="courseList.length>0">
		<view class="choiceClass">
			<!-- 班级选择 -->
			<drop-down ref="drop" :options = 'courseList' @select="toggleCurrentCourse" />
		</view>
		<!-- 已签列表 -->
		<view v-if="signList.id" class="list">
			<text class="signTitle">已签</text>
			<scroll-view v-if="signList.signList.length>0" class="scroll" :scroll-y="true"  :scroll-into-view="singScrollInto">
				<view :id="`s${index}`" class="signList" v-for="(item,index) in signList.signList" :key="index" >
					<view class="student">
						<text class="name">{{item.student_list.name}}</text>
						<view class="status">
							<image @click="showExtend('signIndex',index)" class="img" :src='signOptionIcon(index)'></image>
							<text v-if="signIndex!==index"  :style="{color:item.leave===1?'red':''}">{{signStatus(item)}}</text>
							<view v-else class="options animated fadeInRight">
								<text v-if="item.leave===1" @click="teacherOptions(['sign','signList',index],`为 ${item.student_list.name} 签到`)">签到</text>
								<text @click="teacherOptions(['absenteeism','signList',index],`${item.student_list.name} 旷课`)">旷课</text>
								<text @click="teacherOptions(['late','signList',index],`${item.student_list.name} 迟到`)">迟到</text>
								<text @click="teacherOptions(['leaveEarly','signList',index],`${item.student_list.name} 早退`)">早退</text>
								<text v-if="item.leave!==1" @click="teacherOptions(['leave','signList',index],`为 ${item.student_list.name} 请假`)">请假</text>
							</view>
						</view>
						<view class="address">
							<image src="@/static/img/iconfont/address.svg"></image>
							<text>{{item.address}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<text class="signMsg" v-else>暂时还没有同学签到哦</text>
			<text class="signTitle">未签</text>
			<scroll-view v-if="signList.noSignList.length>0" class="scroll" :scroll-y="true" :scroll-into-view="noSingScrollInto">
				<view :id="`ns${index}`" v-for="(item,index) in signList.noSignList" :key="index" >
					<view class="noSign" @click="showExtend('noSignIndex',index)">
						<text>{{item.student_list.name}}</text>
						<image src="@/static/img/iconfont/arrow.svg" class="arror"></image>
					</view>
					<view class="extend animated fadeInDown" v-if="index === noSignIndex">
						<text @click="teacherOptions(['sign','noSignList',index],`为 ${item.student_list.name} 签到`)" class="btn" style="background-color: #174B89;">
							代签
						</text>
						<text @click="teacherOptions(['late','noSignList',index],`${item.student_list.name} 迟到`)" class="btn" style="background-color: #C46C5D;">
							迟到
						</text>
						<text @click="teacherOptions(['leave','noSignList',index],`为 ${item.student_list.name} 请假`)" class="btn" style="background-color: #12B7F5;">
							请假 
						</text>
					</view>
				</view>
			</scroll-view>
			<text class="signMsg" v-else>所有同学都完成签到啦</text>
		</view>
		<nothing msg="暂未发布签到" v-else/>
		<view class="bottomBua">
			<view v-if="signList.id">
				<view class="btn">
					<text @click="teacherOptions(['signAll'],'为所有未签到的同学代签')">代签</text> |
					<text @click="teacherOptions(['lateAll'],'所有未签到的同学都设为迟到')">迟到</text>
				</view>
			</view >
			<view v-else class="btn" @click="createSign()">发布签到</view>
		</view>
		<!-- 确认框 -->
		<uni-popup ref="popup" type="center"> 
			 <uni-popup-dialog mode="base" :content="popupContent" @close="popupResult(false)" @confirm="popupResult(true)"></uni-popup-dialog>
		</uni-popup>
	</view>
	<nothing msg="暂无授课班级" v-else/>
</template>

<script>
	import DropDown from '@/components/uniapp/wyb-drop-down/wyb-drop-down.vue'
	import courseServers from '@/public/api/course.js'
	import {showLoading,message,showModel} from '@/public/common/baseFn.js'
	import websocketUtil from '@/public/common/socket.js'
	import socketServerd from '@/public/api/socket.js'
	import nothing from '@/components/nothing.vue'
	export default {
		components:{
			DropDown,
			nothing,
		},
		data() {
			return {
				courseList:[],
				webSocket:null,
				signList:{},//签到列表
				currentCourseIndex:0, // 课程索引
				noSignIndex:-1, //未签到索引
				signIndex:false,
				popupContent:'',//弹出显示内容
				singScrollInto:"",//scroll滑动到指定元素
				noSingScrollInto:"",
				
			};
		},
		created() {
			showLoading('课程获取中');
			this.getCourseList()
			
			// 连接socket
			this.webSocket = new websocketUtil()
		},
		onLoad() {
			this.webSocket.Message((data)=>{
				this.studentSign(data)
			})
		},
		methods:{
			// 图标选择
			signOptionIcon(index){
				let url=['../../../../static/img/iconfont/arrowLeft.svg','../../../../static/img/iconfont/arrowRight.svg']
				return this.signIndex===index?url[0]:url[1]
			},
			// 签到状态
			signStatus(data){
				if(data.leave===1) return "请假"
				else if(data.late===1) return "迟到"
				else if (data.leave_early === 1) return '早退'
				else if (data.absenteeism === 0) return '已签'
			},
			// 获取课程列表
			async getCourseList(){
				let [err,res] = await courseServers.getCourseList();
				if(!this.$http.errorCheck(err,res)) return false;
				this.courseList = res.data.data
				console.log(res.data.data)
				this.getSignInfo()
			},
			// 切换当前课程
			toggleCurrentCourse(index){
				this.currentCourseIndex=index;
			},
			// 获取学生签到列表
			async getSignInfo(){
				showLoading('信息获取中...')
				let [err,res] = await courseServers.getStudensSignList();
				uni.hideLoading();
				if (!this.$http.errorCheck(err,res)) return false;
				this.signList = res.data.data;
				console.log('------',this.signList);
			},
			// 展开扩展框
			showExtend(ref,index){
				if(this[ref] === index){
					this[ref] = -1
					return false
				}
				this[ref] = index
			},
			// 发布签到
			async createSign(){
				if(!this.courseList.length>0) {
					message('课程错误')
					return false;
				}
				let content = `确定为 ${this.courseList[this.currentCourseIndex].className} 班创建 ${this.courseList[this.currentCourseIndex].courseName} 签到`
				let [err,res] = await showModel(content)
				if(res.confirm){
					showLoading("发布中...");
					let list = this.courseList[this.currentCourseIndex]
					let [err,res] = await courseServers.createSign(list.class_id,list.course_id)
					uni.hideLoading();
					if(!this.$http.errorCheck(err,res)) return false;
					this.getSignInfo();
				}
				
			},
			
			// 操作
			async teacherOptions(data,content){
				let [err,res] = await showModel(content)
				if(res.confirm){
					showLoading('操作中...');
					
					let param = {
						id:this.signList.id,
						method : data[0],
						studentId : data[0]==="signAll" || data[0]==="lateAll"?'': this.signList[data[1]][data[2]].student_id,
						is_teacher_options:1,
						
					};
					console.log(param)
					let [err,res] = await courseServers.teacherOptions(JSON.stringify(param));
					uni.hideLoading()
					if(!this.$http.errorCheck(err,res)) return false;
					let noSignList = [];
					let signList = {};
					switch(data[0]){
						// 签到
						case 'sign':
							noSignList={
								'absenteeism' : 0
							};
							signList={
								'leave':0,
								'absenteeism':0,
								'late':0,
								'leave_early':0
							}
							break;
						// 旷课
						case 'absenteeism':
							// 在未签到列表中找出该学生，移到签到表中
							let user = this.signList['signList'].splice([data[2]],1)[0];
							user.absenteeism = 1;
							this.signList['noSignList'].push(user);	
							this.noSingScrollInto = `ns${this.signList['noSignList'].length-1}`
							break;
						// 早退
						case 'leaveEarly':
							signList={
								'leave':0,
								'late':0,
								'leave_early':1
							}
							break;
						// 迟到
						case 'late':
							signList = {
								'late' : 1,
								'leave' : 0,
								'absenteeism' : 0,
							}
							noSignList = {
								'late' : 1,
								'leave' : 0,
								'absenteeism' : 0,
							}
							
							break;
						// 请假
						case 'leave':
							signList={
								'leave':1
							};
							noSignList={
								'leave':1,
								'absenteeism' : 0
							}
							break;
						case 'signAll':
							this.signList.noSignList.forEach((item)=>{
								item.absenteeism = 0
								this.signList.signList.push(item)
							})
							this.signList.noSignList=[]
							// scroll滚动
							this.singScrollInto = `s${this.signList['signList'].length-1}`
							break;
						case 'lateAll':
							this.signList.noSignList.forEach((item)=>{
								item.late = 1
								item.absenteeism = 0
								item.address = "教师代签"
								this.signList.signList.push(item)
							})
							this.signList.noSignList=[]
							// scroll滚动
							this.singScrollInto = `s${this.signList['signList'].length-1}`
							break;
					}
					// 获取key值
					let signKey = Object.keys(signList)
					let noSignKey = Object.keys(noSignList)
					if(data[1]==='noSignList'){
						// 在未签到列表中找出该学生，移到签到表中
						let user = this.signList['noSignList'].splice([data[2]],1)[0];
						for(let i=0;i<noSignKey.length;i++){
							let key = noSignKey[i]
							user[key] = noSignList[key]
						}
						this.signList['signList'].push(user);
						// scroll滚动
						this.singScrollInto = `s${this.signList['signList'].length-1}`
					}else if(signKey.length>0) {
						// 遍历signKey，逐一赋值
						for(let i=0;i<signKey.length;i++){
							let key = signKey[i]
							this.signList['signList'][data[2]][key] = signList[key]
						}
					}
					this.signIndex = -1;
					this.noSignIndex = -1;
				}
				// 取消
				return false
			},
			// 学生签到
			studentSign(id){
				// 在未签到表中找到该学生
				this.signList.noSignList.forEach((item,index)=>{
					if(item.student_id===id){
						let user = this.signList.noSignList.splice(index,1)[0]
						user.absenteeism=0
						this.signList.signList.push(user);
						this.singScrollInto = `s${this.signList['signList'].length-1}`
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
@import '/static/css/base.css';
@import '/static/css/animate.min.css';
	.sign {
		width: 100vw;
		box-sizing: border-box;
		padding: 0 15px;
	}
	.signTitle {
		height: 40px;
		line-height: 40px;
		color: #999999;
	}
	.choiceClass {
		position: relative;
		height: 60px;
	}
	.list {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: calc(100vh - 130px);
	}
	.scroll {
		flex: -1;
		// 总高 - （choiceClass+bottomBua）- （margin - padding）
		// max-height: calc((100vh - 130px - 105px)/2);
		min-height: 150rpx;
		border-radius: 10px;
		.signList {
			padding: 10px 0;
		}
	}
	.student {
		position: relative;
		margin-bottom: 10px;
		.name {
			display: inline-block;
			height: 40px;
			line-height: 40px;
			font-size: 17px;
		}
		
		.address {
			image {
				width: 20px;
				height: 20px;
				vertical-align: middle;
				padding-right: 10px;
			}
			text {
				font-size: 16px;
				color: #606266;
			}
		}
	}
	.status {
		display: inline-block;
		position: absolute;
		right: 0;
		color: var(--color);
		top: 5px;
		height: 30px;
		line-height: 30px;
		.img {
			width: 25px;
			height: 25px;
			margin-right: 10px;
			vertical-align: middle;
		}
		.options {
			display: inline-block;
			text {
				margin: 0 10px 0 5px;
			}
			text:last-child {
				margin-right: 0;
			}
		}
	}
	.noSign {
		position: relative;
		height: 35px;
		line-height: 35px;
		font-size: 17px;
	}
	.extend {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		height: 50px;
		border-radius: 5px;
		background-color: #EEEEEE;
		text {
			display: inline-block;
			height: 25px;
			line-height: 25px;
			padding: 0 10px;
			border-radius: 25px;
			color: #FFFFFF;
			font-size: 12px;
		}
	}
	.arror {
		width: 20px;
		height: 20px;
		position: absolute;
		right: 0;
		top: 5px;
		transform: rotate(-90deg);
	}
	.bottomBua {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 70px;
		box-sizing: border-box;
		border:1px solid #eeeeee;
		background-color: #FFFFFF;
		padding: 0 10px;
		z-index: 10;
		.btn {
			position: absolute;
			top: 15px;
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
			text {
				display: inline-block;
				width: 49%;
				height: 100%;
				
			}
		}
	}
	.signMsg {
		display: block;
		width:100%;
		height: 60px;
		line-height: 60px;
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		color: #999999;
	}
</style>
