<template>
	<view class="timetable">
		<view class="header">
			<view class="header-item" v-for="(item, index) in week" :key="item" :style="{ color: todayWeekIndex === index ? '#4070FF' : 'unset' }">{{ item }}</view>
		</view>

		<view class="main">
			<view class="row" v-for="(item, index) in timetableType" :key="index">
				<view class="time-item">
					<view class="index">{{ item.index }}</view>
					<view class="time">{{ item.name }}</view>
				</view>
			</view>

			<view class="course-container">
				<view class="week" v-for="(week, weekIndex) in schedule" :key="weekIndex">
					<view class="courseList" v-for="(course, courseIndex) in week" :key="courseIndex">
						<view
							@click="handleCourseClick(course)"
							class="course"
							:style="{ height: course.length * 80 + 'px', background: course.backgroundColor }"
							v-if="course.length > 0"
						>
							<text>{{ course.course }}</text>
							<text v-show="course.list">{{ '\n' + course.list }}</text>
							<text v-show="course.room">{{ '\n' + course.room }}</text>
							<text v-show="course.week">{{ '\n' + course.week }} 周</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CourseServer from '@/public/api/course.js';
import { showLoading, setStorage, getStorage } from '@/public/common/baseFn.js';
export default {
	name: 'Timetable',
	props: {
		timetableType: {
			type: Array,
			default: () => {
				return [];
			}
		},
		week: {
			type: Array,
			default: () => {
				return ['一', '二', '三', '四', '五'];
			}
		},
		palette: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			schedule:[],//显示的格式
			timetables: [],//存储后端返回的数据
			allPalette: [
				...this.palette,
				'#f05261',
				'#48a8e4',
				'#ffd061',
				'#52db9a',
				'#70d3e6',
				'#52db9a',
				'#3f51b5',
				'#f3d147',
				'#4adbc3',
				'#673ab7',
				'#f3db49',
				'#76bfcd',
				'#b495e1',
				'#ff9800',
				'#8bc34a'
			]
		};
	},
	computed: {
		todayWeekIndex() {
			let weekIndex = new Date().getDay() - 1;
			if (weekIndex === -1) {
				weekIndex = 6;
			}
			return weekIndex;
		},
		
	},
	async created() {
		let timetables = getStorage('timetables');
		if(timetables!=null){
			this.schedule = timetables
			this.$nextTick(async()=>{
				this.timetables = await this.getCourseList()
				this.schedule = this.courseData();
			})
		}else{
			showLoading('课表获取中')
			this.timetables = await this.getCourseList()
			this.schedule = this.courseData();
		}
		
	},
	methods: {
		handleCourseClick(course, weekIndex, courseIndex) {
			if (course.course != null)
				uni.showModal({
					title: '详情',
					content: `${course.course}\n${course.list}\n${course.room}\n${course.week}周`,
					showCancel: false
				});
		},
		// 获取课程表
		async getCourseList() {
			let [err, res] = await CourseServer.getCourseList();
			uni.hideLoading();
			if (!this.$http.errorCheck(err, res)) return false;
			if (res.data.data.length === 0) {
				message('您暂无安排上课哦');
			}
			return res.data.data;
		},
		// 格式化课表
		courseData() {
			// 为数据标记背景颜色的函数
			let paletteIndex = 0;
			const getBackgroundColor = () => {
				const backgroundColor = this.allPalette[paletteIndex];
				paletteIndex++;
				if (paletteIndex >= this.allPalette.length) {
					paletteIndex = 0;
				}
				return backgroundColor;
			};
			// 合并
			const listMerge = [];
		
			this.timetables.forEach(function(list, i) {
				if (list.length === 0) {
					listMerge[i] = [];
					return false;
				}
				// 一天的课
				// const courseList = new Array(10).fill({ length: 1, backgroundColor: null });
				const courseList = [
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null },
					{ length: 1, backgroundColor: null }
				];
		
				list.forEach((item, index) => {
					let node = item.node.split(',');
					for (let key = Number(node[0] - 1); key < Number(node[1]); key++) {
						if (key === Number(node[0] - 1)) {
							courseList[key].length = Number(node[1]) - Number(node[0]) + 1;
							if (courseList[key].course == null) {
								// 无值 添加
								courseList[key].course =
									item.is_double === 2
										? item.course_list.course_name
										: item.is_double === 1
										? '（双）' + item.course_list.course_name
										: '（单）' + item.course_list.course_name;
		
								courseList[key].room = item.class_room;
								courseList[key].list = item.list.name;
								courseList[key].week = item.start_week + '-' + item.end_week;
								courseList[key].backgroundColor = getBackgroundColor();
							} else {
								// 这一节课已经有值（判断是否是单双周，不是则是不同教师上同一堂课,）
								if (item.is_double === 2) {
									//不是单双周（合并room,将room写为'',此时list为教师名，重写list）
									courseList[key].list += courseList[key].room + '\n@' + item.list.name + ' ' + item.class_room;
									courseList[key].room = '';
								} else {
									// 是
									// 判断课程名是否相同
									if (courseList[key].course === (item.is_double === 1 ? '（单）' : '（双）') + item.course_list.course_name) {
										// 课程名相同，课程名不变，更改班级或教师名
										courseList[key].list += '\n@' + (item.is_double === 1 ? '（双）' : '（单）') + item.list.name;
									} else {
										// 课程名不同
										courseList[key].course +=
											'\n' +
											courseList[key].list +
											'\n' +
											courseList[key].room +
											(item.is_double === 1 ? '（双）' : '（单）') +
											item.course_list.course_name +
											'\n' +
											item.list.name +
											'\n' +
											item.class_room;
		
										courseList[key].list = '';
										courseList[key].room = '';
									}
								}
							}
						} else {
							courseList[key].length = 0;
						}
						// 	key++;
					}
				});
				listMerge.push(courseList);
			});
			setStorage('timetables', listMerge);
			return listMerge;
		},
	}
};
</script>

<style scoped lang="scss">
.timetable {
	background: white;
	border: 1px solid #e4e7ed;
	border-radius: 8rpx;

	.header {
		padding-left: 88rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		background: #f5f7fa;

		.header-item {
			flex: 1;
			text-align: center;
		}
	}

	.main {
		position: relative;
		.row {
			height: 80px;
			position: relative;
			&:after {
				content: '';
				height: 0;
				width: 100%;
				position: absolute;
				bottom: 0;
				left: 0;
				border-bottom: 1rpx dashed #e4e7ed;
			}

			.time-item {
				height: 100%;
				width: 88rpx;
				text-align: center;
				background: #f5f7fa;

				.index {
					color: #909399;
					padding-bottom: 8rpx;
					padding-top: 16rpx;
				}
			}
		}

		.course-container {
			position: absolute;
			top: 0;
			left: 88rpx;
			width: calc(100% - 88rpx);
			height: 100%;
			display: flex;

			.week {
				flex: 1;
				width: 0;
				flex-grow: 1;
				display: flex;
				flex-direction: column;

				.courseList {
					word-break: break-all;
					color: white;
					overflow: hidden;

					.course {
						border-radius: 16rpx;
						text-align: center;
						padding: 8rpx;
						box-sizing: border-box;
						font-size: 13px;
					}
				}
			}
		}
	}
}
</style>
