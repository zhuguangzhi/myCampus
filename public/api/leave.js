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
}