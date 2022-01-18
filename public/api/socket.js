import Request from '../common/request.js'
export default class socketServers {
	// 签到完成推送
	static signPushToTeacher(param){
		return Request.post('/signPushToTeacher',{
			"createSignId":param.createSignId,
			"signId" : param.signId,
		},{"token":true})
	}
}