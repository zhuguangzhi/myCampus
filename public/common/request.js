// 引入配置文件
import BaseConfig from "../config/BaseConfig.js";
import User from '../config/user.js';
import  { toPage,message }  from '@/public/common/baseFn.js'
import UserLogin from '../api/login.js'
export default{
	config:{
		baseUrl:BaseConfig.webUrl,
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
	},
	request(options = {}){
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseUrl + options.url;
		// TODO：token增加等操作
		if (options.token) {
			options.data['userId'] = User.userInfo.userId;
			options.header.token = User.userInfo.token;
		}
		return uni.request(options);
	},
	get(url,data={},options={}){
		options.url = url;
		options.data = data;
		options.method = 'GET';
		return this.request(options);
	},
	post(url,data={},options={}){
		options.url = url;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	delete(url,data={},options={}){
		options.url = url;
		options.data = data;
		options.method = 'DELETE';
		return this.request(options);
	},
	// 错误处理
	errorCheck(err,res,errfun = false,resfun = false){
		if (err) {
			typeof errfun === 'function' && errfun();
			uni.showToast({ title: '请求失败',icon:"none" });
			return false;
		}
		else if (res.data.errorCode) {
			typeof errfun === 'function' && resfun();
			console.log(res.data,'----------')
			// 判断是否是登录失败
			if(res.data.errorCode === 40003){
				uni.showToast({ title: '登录已失效,2秒后跳至登录页',icon:"none" });
				setTimeout(()=>{
					toPage('/pages/Login/Index','reLaunch');
				},2000)
				return false;
			}
			else if (res.data.errorCode === 40009){
				message(res.data.msg,2000,true)
				setTimeout(()=>{
					toPage('/pages/Leave/Leave','reLaunch');
				},2000)
			}
			uni.showToast({ title: res.data.msg,icon:"none" });
			return false;
		}
		else if (res.statusCode>400){
			typeof errfun === 'function' && errfun();
			uni.showToast({ title: '请求错误',icon:"none" });
			return false;
		}
		return true;
	},
	
	// 上传
	uploadImage(options ={}){
		options.url=this.config.baseUrl+'/uploadImage';
		options.header = options.header || this.config.header;
		options.fileType = options.fileType || 'multipart/form-data';
		options.formData = options.formData || {};
		options.filePath = options.filePath;
		options.formData = options.data || {};
		options.formData['userId'] =  User.userInfo.userId;
		options.header.token = User.userInfo.token;
		console.log(options)
		return uni.uploadFile(options);
	}
}
