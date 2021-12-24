// 引入配置文件
import BaseConfig from "../config/BaseConfig.js";
import User from '../config/user.js';
import  { toPage }  from '@/public/common/baseFn.js'
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
	async request(options = {}){
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseUrl + options.url;
		// TODO：token增加等操作
		if (options.token) {
			
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
	// 错误处理
	errorCheck(err,res,errfun = false,resfun = false){
		if (err) {
			typeof errfun === 'function' && errfun();
			uni.showToast({ title: '请求失败',icon:"none" });
			return false;
		}
		if (res.data.errorCode) {
			typeof errfun === 'function' && resfun();
			// 判断是否是登录失败
			if(res.data.errorCode === "40003"){
				toPage('/pages/Login/Index','redirectTo');
				return false;
			}
			uni.showToast({ title: res.data.msg,icon:"none" });
			return false;
		}
		return true;
	},
	
	// 上传
	upload(url,options ={}){
		options.url=this.config.baseUrl+url;
		options.header = options.header || this.config.header;
		options.fileType = options.fileType || 'image';
		options.formData = options.formData || {};
		options.filePath = options.filePath;
		options.data = options.data || {};
		if(options.token){
			options.header.token = User.userInfo.token;
		}
		return uni.uploadFile(options);
	}
}
