import BaseConfig from '@/public/config/BaseConfig.js'
import amap from "@/lib/amap-wx.js"

let root = BaseConfig.storageRoot
// 消息提示
const message = function(msg='加载中',time=2000,mask=false) {
		uni. showToast({
			title:msg,
			icon:'none',
			duration:time,
			mask:mask
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
		
}// 加载
const showLoading =function(title='加载中',mask=true){
	uni.showLoading({
		title:title,
		mask:mask,
	})
}
// 高德 地址逆编码
const getreverseGeocode =function(longitude,latitude,that) {
	let key= BaseConfig.AmapKey
	const amapPlugin = new amap.AMapWX({key});
	let location= '' + longitude + ',' + latitude + ''; //location的格式为'经度,纬度'
	amapPlugin.getRegeo({
		location,
		success:(data)=>{
			
			// 获取省名+市名
			let str = data[0].regeocodeData.addressComponent.province + data[0].regeocodeData.addressComponent.city
			let address = data[0].regeocodeData.formatted_address
			address = address.replace(str,'')
			that.address = address;
		},
		fail:(err)=>{
			that.address = err
		}
	})
}
// 模态框
const showModel = async function(content){
	let options={
		title: '提示',
		content: content,
		cancelText: "取消", // 取消按钮的文字  
		confirmText: "确定", // 确认按钮文字  
		showCancel: true, // 是否显示取消按钮，默认为 true
		confirmColor: '#174B89',
		cancelColor: '#999999',
	}
	return await uni.showModal(options)
}
const previewImage=function(index, imgList) {
	// 图片预览
	uni.previewImage({
		urls: imgList,
		current: imgList[index],
		longPressActions: {
			itemList: ['保存图片'],
		}
	});

}
export  {
	 message,
	 setStorage,
	 getStorage,
	 showLoading,
	 sleep,
	 toPage,
	 delStorage,
	 getreverseGeocode,
	 showModel,
	 previewImage
}