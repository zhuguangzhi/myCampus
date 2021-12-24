import Request from '../common/request.js'
import User from '../config/user.js'
export default class loginServe {
	// 账号密码登录
	static login(params){
		return Request.post('/login',{
			"userId":params.userId,
			'password':params.password,
			'code':params.code,
			'systemId':params.systemId
		})
	}
	// token登录
	static tokenLogin(){
		if(!User.userInfo){
			uni.showToast({ title: '登录失败', icon:"none" })
			uni.navigateTo({
				url: '/pages/login/index'
			});
			return new Promise(()=>{
				return false;
			});
		}
		return Request.post('/tokenLogin',{},{'token':true});
	}
	static getOpenId(userId,systemId,code){
		return Request.get('/getOpenId',{userId,systemId,code})
	}
	static bindOpenId(userId){
		return Request.post('/bindOpenId',{"userId":userId})
	}
	// 校验密码
	static checkPassword(userId,password) {
		return Request.post('/checkPassword',{userId,password})
	}
	// 重置密码
	static revisePassword(userId,password){
		return Request.post('/revisePassword',{userId,password})
	}
}