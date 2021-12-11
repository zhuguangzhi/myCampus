import Request from '../common/request.js'
export default class faceServers {
	// 创建人脸
	static createFace(params){
		if(params){
			return Request.post('/face/createFace',params)
		}
	}
	// 人脸核验
	static checkFace(params){
		if(params){
			return Request.post('/face/checkFace',params)
		}
	}
}