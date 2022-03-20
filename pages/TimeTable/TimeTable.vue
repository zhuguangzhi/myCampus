<template>
	<Timetable :timetableType="timetableType"></Timetable>
</template>

<script>
import Timetable from '@/components/uniapp/lpx-timetable/lpx-timetable';
import CourseServer from '@/public/api/course.js';
import { showLoading, setStorage, getStorage } from '@/public/common/baseFn.js';
export default {
	name: 'TimeTable',
	components: {
		Timetable
	},
	data() {
		return {
			timetableType: []
		};
	},
	async created() {
		let timetableType = getStorage('timetableType');
		if (timetableType != null) {
			
			this.timetableType = timetableType
			this.$nextTick(async()=>{
				// 跟后端进行对比，判断值是否变了，不需用户加载等待
				this.timetableType = await this.getCurrentSchedule();
			})
		} else {
			showLoading();
			this.timetableType = await this.getCurrentSchedule();
		}
	},
	methods: {
		// 获取作息表
		async getCurrentSchedule() {
			let [err, res] = await CourseServer.getCurrentSchedule();
			uni.hideLoading();
			if (!this.$http.errorCheck(err, res)) {
				return false;
			}
			setStorage('timetableType',res.data.data)
			return res.data.data;
		},
		
	}
};
</script>

<style lang="less"></style>
