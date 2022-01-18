import Request from '../common/request.js'
export default class leaveServers {
	// 申请请假
	static applyLeave(params){
		if(params){
			return Request.post('/leave',params,{"token":true})
		}
	}
	// 获取请假列表
	static getLeaveList(page){
		return Request.get('/getLeaveList',{page:page},{"token":true})
	}
	// 获取请假详情
	static getLeaveInfo(id){
		return Request.get('/getLeaveInfo',{leaveId:id},{"token":true})
	}
	// 获取学生请假申请
	static getStudentsLeaveList(page){
		return Request.get('/getStudentLeaveList',{page},{"token":true})
	}
	// 批假
	static approveLeave(params){
		return Request.post('/approveLeave',{
			"leaveId":params.id,
			'marks':params.marks,
			'approveResult':params.approveResult
		},{"token":true})
	}
	// 获取销假列表
	static getDivideLeave(page) {
		return Request.get('/getDivideLeave',{page},{"token":true})
	}
	// 销假
	static divideLeave(params) {
		return Request.post('/divideLeave',{'data':JSON.stringify(params)},{"token":true})
	}
}