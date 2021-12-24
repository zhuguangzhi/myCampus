<template>
	<student-leave v-if="!showLeave"></student-leave>
	<teacher-leave v-else></teacher-leave>
</template>

<script>
	import studentLeave from '../component/student/studentLeaveInfo.vue'
	import teacherLeave from '../component/teacher/searchLeaveInfo.vue'
	import userConfig from '@/public/config/user.js'
	export default {
		name:"LeaveInfo",
		components:{
			studentLeave,
			teacherLeave
		},
		data() {
			return {
				// true学生 false老师
				showLeave:null
			};
		},
		created() {
			this.showLeave = userConfig.userInfo.isTeacher
		}
	}
</script>

<style lang="less">

</style>
