import Request from '../common/request.js'
export default class leaveServers {
	// 申请请假
	static applyLeave(params){
		if(params){
			return Request.post('/leave',params,{"token":true})
		}
	}
}