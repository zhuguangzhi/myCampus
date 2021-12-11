import Request from '../common/request.js'
import User from '../config/user.js'
export default class loginServe {
	// 账号密码登录
	static login(userId,password){
		return Request.post('/login',{userId,password})
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
		return Request.post('/getOpenId',{userId,systemId,code})
	}
	static bindOpenId(userId){
		return Request.post('/bindOpenId',{"userId":userId})
	}
	// 获取openId相关信息
	static getBindNum(userId){
		return Request.post('/getBindNum',{"userId":userId})
	}

}