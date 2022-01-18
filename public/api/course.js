import Request from '../common/request.js'
export default class courseServers {
	// 获取课程
	static getCourseList(){
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
}