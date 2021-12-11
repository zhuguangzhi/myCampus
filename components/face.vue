<template>
	<view class="container">
		<view class="cover">
	       <view class="line"></view>
	    </view>
	    <camera device-position="front" resolution="low"  frame-size="small" flash="off" binderror="error" class="camera">
		</camera>
		<text class="error" v-if="errorMsg">
			{{errorMsg}}
		</text>
		<button class="backBtn" @click="reBack()">返回</button>
	</view>
</template>
<script>
	import faceSrevers from '@/public/api/face.js'
	import BaseConfig from '@/public/config/BaseConfig.js'
	import {message,toPage} from '@/public/common/baseFn.js'
	// 错误次数
	let errTime = 0;
	export default{
		name:'Face',
		data(){
			return {
				imgBase64:null,
				errorMsg:''
			}
		},
		props:{
			face:{
				default:'faceCheck',
				type:String
			},
			userId:String,
		},
		mounted() {
			this.$nextTick(()=>{
				this.takePhoto();
			})
		},
		methods:{
			takePhoto(time=2000) {
				const ctx = uni.createCameraContext()
				setTimeout(()=>{
					ctx.takePhoto({
					  quality: 'normal',
					  success: (res) => {
					    // 把图片转成base64
					    this.imgBase64 = uni.getFileSystemManager().readFileSync(res.tempImagePath, 'base64')
						this.faceApi();
					  }
					})
				},time)
			  
			},
			// 腾讯云api操作
			async faceApi(){
				let err=null;
				let res=null;
				switch(this.face){
					case 'create':
						[err,res] = await faceSrevers.createFace({'image':this.imgBase64,'userId':this.userId})
						break;
					case 'faceCheck':
						[err,res] = await faceSrevers.checkFace({'image':this.imgBase64,'userId':this.userId})
						break;
					case 'delFace':
						break;
				}
				let checkResulet = await this.faceError(err,res.data);
				if (typeof checkResulet === 'boolean'){
					this.$emit('checkResult',checkResulet);
				}
				
			},
			reBack(){
				this.$emit('checkResult',false);
			},
			// 错误处理
			faceError (err,res){
				if(res.errorCode){
					if( res.errorCode==='999' && errTime<5){
						errTime+=1;
						this.takePhoto();
					}else if(res.errorCode==='1003' && errTime<5) {
						// 人脸问题
						this.errorMsg = res.msg;
						errTime+=1;
						this.takePhoto(5000);
						
					}else if(res.errorCode==='1002' || res.errorCode==='1005'){
						// 账号问题
						message(res.msg,3000);
						return false;
					}else if(errTime===5){
						message('多次验证失败，请换个环境再试试吧',3000);
						return false;
					}else {
						return true;
					}
					
				}else {
					errTime=0;
					return true;
				}
				
			}
		}
	}
</script>
<style lang="less" scoped>
	@import '/static/css/weui.css';
	.weui-form__opr-area{
	  margin-bottom: 20px;
	}
	.container{
	  position: absolute;
	  top: 0;
	  left: 0;
	  z-index: 10;
	  text-align: center;
	  width: 100vw;
	  height: 100vh;
	  background-color: #FFFFFF;
	  box-sizing: border-box;
	  padding-top: 80px;
	}
	.camera,
	.cover {
		width: 90vw; 
		height: 90vw;
		border-radius: 100%;
		margin:0 auto;
	}
	.cover{
	  position: absolute;
	  left: 5vw;
	  z-index: 999;
	  opacity: 1;
	  overflow: hidden;
	}
	.cover .line{
	  width: 100%;
	  height: 2px;
	  background-color: #0f0;
	  box-shadow: 0 -4px 5px #0f0;
	  animation: top-bot 2s  ease-in-out infinite;
	}
	.error {
		position: absolute;
		top: 10px;
		left: 5vw;
		width: 90vw;
		display: block;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 16px;
		color: var(--color);
	}
	.backBtn {
		position: absolute;
		width: 90vw;
		height: 40px;
		line-height: 40px;
		color: #FFFFFF;
		background-color: var(--color);
		text-align: center;
		bottom: 30px;
		left: 5vw;
	}

	@keyframes top-bot{
	  0%{
	    transform: translateY(0);
	  }
	
	  100%{
	    transform: translateY(90vw);
	  }
	}
</style>