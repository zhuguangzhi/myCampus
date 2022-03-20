import BaseConfig from '@/public/config/BaseConfig.js'
import UserConfig from '@/public/config/user.js'
import {message,showLoading} from '@/public/common/baseFn.js'

class websocketUtil {
	constructor() {
		this.socket_clock = false //避免重复连接
		this.url = BaseConfig.websocketUrl //地址
		this.data = null
		this.reconnectNum = 5 //重连次数
		this.reconnectTiem = 3 //重连时间
		this.heartbeatInterval= null //检测服务器端是否还活着
		this.reconnectTimeOut= null //重连之后多久再次重连
		try {
			return this.connectSocketInit()
		} catch (e) {
			this.socket_clock = false
			this.reconnect();
		}
	}

	// 进入这个页面的时候创建websocket连接【整个页面随时使用】
	connectSocketInit() {
		this.socketTask = uni.connectSocket({
			url: this.url,
			success:()=>{
				// 返回实例
				return this.socketTask
			},
		});
		this.socketTask.onOpen((res) => {
			this.send('绑定','bind');
			this.reconnectNum = 5
			clearTimeout(this.reconnectTimeOut)
			clearTimeout(this.heartbeatInterval)
			this.Message();
			this.start();
		})
		// 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接
		// uni.onSocketError((res) => {
		// 	console.log('WebSocket连接打开失败，请检查！');
		// 	this.is_open_socket = false;
		// 	this.reconnect();
		// });
		// 这里仅是事件监听【如果socket关闭了会执行】
		this.socketTask.onClose(() => {
			this.reconnect();
		})
	}
	// 注：只有连接正常打开中 ，才能正常收到消息
	Message(func=null){
		this.socketTask.onMessage((e) => {
			let res=JSON.parse(e.data);
			// console.log(e)
			// 判断返回的结果是否是心跳检测
			if(res.type == 'ping')return;
			// 绑定返回结果
			if(res.type == 'bind')return;
			// 通知接口
			if(func){
				func(res);
				return;
			}
		});
	}
	// 手动关闭socket
	close(){
		uni.closeSocket(()=>{
			this.socket_clock = true;
			clearInterval(this.heartbeatInterval)
			clearInterval(this.reconnectTimeOut)
		})
	}
	//发送消息
	send(value,type="message"){
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		let param ={}
		param.userId = UserConfig.userInfo.userId
		param.value = value
		param.type = type
		this.socketTask.send({
			data: JSON.stringify(param),
			success:(res)=>{
				// console.log(res)
			}
		});
	}
	//开启心跳检测
	start(){
		this.heartbeatInterval = setInterval(()=>{
			this.send('心跳','ping');
		},30*1000)
	}
	//重新连接
	reconnect(){
		//停止发送心跳
		clearInterval(this.heartbeatInterval)
		//如果不是人为关闭的话，进行重连
		if(!this.socket_clock ){
			if(this.reconnectNum>0){
				this.reconnectTimeOut = setTimeout(async ()=>{
				
					this.reconnectNum -=1
					// 重连时间 5*1 6*2 7*3 8*4 9*5
					this.reconnectTiem = (10 - this.reconnectNum) * (6 - this.reconnectNum)
					await this.connectSocketInit();
				},this.reconnectTiem*1000)
			}else {
				uni.hideLoading()
				message('socket多次重连失败，请退出该页面后重试');
			}
		}
	}
}
export default websocketUtil
