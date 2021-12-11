import BaseConfig from '@/public/config/BaseConfig.js'

let root = BaseConfig.storageRoot
// 消息提示
const message = function(msg='加载中',time=2000) {
		uni. showToast({
			title:msg,
			icon:'none',
			duration:time
		})
	}
// 设置缓存
const setStorage = function(key,value){
	if(!key || !value){
		return false
	}
	uni.setStorageSync(`${root}_${key}`,value)
}

// 睡眠函数
const sleep = function(numberMillis) {
     let now = new Date();
     let exitTime = now.getTime() + numberMillis;
     while (true) {
         now = new Date();
         if (now.getTime() > exitTime)
             return;
     }    
}  
// 获取缓存
const getStorage = function(key){
	if(!key) return false
	let storage = uni.getStorageSync(`${root}_${key}`);
	if (!storage) return null;
	return storage;
}
// 删除缓存
const delStorage = function(key){
	if(!key) return false
	uni.removeStorageSync(`${root}_${key}`)
}
// 权限验证跳转
const toPage = function(options,type='navigateTo'){
	// 验证通过
	switch (type){
		case 'navigateTo':
			uni.navigateTo({url:options});
			break;
		case 'redirectTo':
			uni.redirectTo({url:options});
			break;
		case 'reLaunch':
			uni.reLaunch({url:options});
			break;
		case 'switchTab':
			uni.switchTab({url:options});
			break;
	}	
		
}
// 加载
const showLoading =function(title='加载中',mask=true){
	uni.showLoading({
		title:title,
		mask:mask,
	})
}
export  {
	 message,
	 setStorage,
	 getStorage,
	 showLoading,
	 sleep,
	 toPage,
	 delStorage
}