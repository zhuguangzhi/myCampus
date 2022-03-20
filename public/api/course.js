import Request from '../common/request.js'
import userConfig from '@/public/config/user.js';
export default class courseServers {
	// 获取所带课程
	static getMyCourse(){
		return Request.get('/getCourseList',{},{'token':true})
	}
	// 获取签到列表
	static getStudensSignList(signId=null){
		if(signId){
			return Request.get('/getStudentsSignInfo',{"signId":signId},{'token':true})
		}
		return Request.get('/getStudentsSignInfo',{},{'token':true})
	}
	// 发布签到
	static createSign(classId,courseId){
		return Request.post('/createSign',{
			'class_id':classId,
			'course_id':courseId
			
		},{'token':true}) 
	}
	// 教师代签等操作
	static teacherOptions(param){
		return Request.post('/teacherOptions',{'data':param},{'token':true})
	}
	// 学生签到
	static studentSign(signId,teacherId,address,latitude,longitude){
		return Request.post('/studentSign',
			{
				'signId':signId,
				'teacherId':teacherId,
				'address':address,
				'Latitude':latitude,
				'Longitude':longitude
			},
		{'token':true})
	}
	// 获取课程表
	static getCourseList(){
		return Request.get('/getClassScheduleList',{},{'token':true})
	}
	// 获取作息表
	static getCurrentSchedule(){
		return Request.get('/getCurrentSchedule',{},{'token':true})
	}
	// 获取考勤记录
	static getSignList(){
		return Request.get('/getSignList',{},{'token':true})
	}
}