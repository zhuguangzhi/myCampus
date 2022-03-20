<template>
	<view class="post">
		<!-- 多行文本框 -->
		<view class="header">
			<editor id="editor" 
				class="textarea" 
				:read-only="readOnly"
				placeholder="说说此刻的想法吧~" 
				@ready="onEditorReady"
				@click="useEmoji=false"
			>
			</editor>
			<scroll-view scroll-y="true" style="max-height: 400rpx; width: 100%;">
				<img-grid @remove="removeImg" :issure="true" class="grid" :imgList="form.imgList"></img-grid>
			</scroll-view>
			<view class="menu" >
				<image v-for="(item,index) in menu" @click="choseItem(index)"  :key="index" :src="item" class="img"></image>
				<view class="right" @click="choseRight()" >
					<image src="/static/img/iconfont/open.svg" class="rightItem"></image>
					<text>{{rightText}}</text>
				</view>
			</view>
			
		</view>
		<view class="btn" @click="createPost()">
			发布
		</view>
		<!-- 表情 -->
		<emoji :useEmoji="useEmoji" @choseEmoji="choseEmoji"></emoji>
	</view>
</template>

<script>
	import ImgGrid from '@/components/ImgGrid/imgGird.vue'
	import emoji from '@/components/emoji.vue'
	import {message,showLoading} from '@/public/common/baseFn.js'
	import postServers from '@/public/api/post.js'
export default {
	components: {ImgGrid,emoji},
	data() {
		return {
			editorCtx:null,//编辑器的上下文
			menu:[
				'/static/img/iconfont/image.svg',
				'/static/img/iconfont/video.svg',
				'/static/img/iconfont/emoji.svg'
			],
			readOnly:false,
			useEmoji:false,
			rightText:'所有人可见',
			form:{
				imgList:[],
				limitType:0,
			}
			
		};
	},
	watch:{
		useEmoji(val){
			if(val===false){
				this.formatData();
			}
			else {
				this.readOnly=true
			}
		}
	},
	methods:{
		// 格式化数据
		formatData(){
			this.editorCtx.getContents({
				success:async(res)=>{
					this.editorCtx.setContents({
						html:res.html.replace(new RegExp('(<p><br></p>)+'),''),
						success:()=>{
							this.readOnly=false
						}
					})
				}
			})
		},
		// 编辑器初始
		onEditorReady(){
			uni.createSelectorQuery().select('#editor').context((res) => {
				this.editorCtx = res.context 
            }).exec()
		},
		choseItem(index){
			switch(index){
				// 图片
				case 0:
					uni.chooseImage({
					    count: 9, //默认9
					    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    success: (res)=> {
							// 调用imgGrid组件
							for(let item of res.tempFilePaths){
								this.form.imgList.push(item)
							};
					    }
					});
					break;
					// 视频
				case 1:
					this.useEmoji=false
					uni.chooseVideo({
						count: 1,
						sourceType: ['camera', 'album'],
						success: (res)=>{
							this.form.imgList.push(res.tempFilePath)
						}
					});
					break;
					// 表情
				case 2:
					this.useEmoji=!this.useEmoji
					break;
			}    
		},
		choseEmoji(item,id){
			this.editorCtx.insertImage({
				src:item,
				extClass:"emojiSize", 
			})
		},
		// 动态权限
		choseRight(){
			let itemList = [
				'所有人可见',
				'仅本系可见',
				'仅学生可见',
				'仅老师可见'
			]
			uni.showActionSheet({
			    itemList: itemList,
			    success: (res)=>{
					this.form.limitType=res.tapIndex;
					this.rightText=itemList[res.tapIndex];
			    }
			});
		},
		// 移除添加的图片或视频
		removeImg(index){
			this.form.imgList.splice(index,1)
		},
		async createPost(){
			this.useEmoji=false;
			let content = await this.editorCtx.getContents()
			content.html=content.html.replace(new RegExp('(<p><br></p>)+'),'')
			let reg = new RegExp('[\u4e00-\u9fa5|a-zA-Z|0-9]','g')
			if(!reg.test(content.text)){
				message('请说点什么吧~')
				return false;
			}
			showLoading('发布中...')
			setTimeout(()=>{
				createApi()
			},200);
			let that = this
			async function createApi(){
				let [postErr,postRes] = await postServers.createPost(content.html,that.form.limitType);
				uni.hideLoading();
				if(!that.$http.errorCheck(postErr,postRes)) return;
				// 判断是否有图片或视频
				if(that.form.imgList.length>0){
					// 有
					for (let item of that.form.imgList) {
						that.$http.uploadImage({
							name:'postImage[]',
							filePath:item,
							token:true,
							checkToken:true,
						});
					}
				}
			}
			// 返回到上一级路由
			uni.navigateBack();
		},
	}
};
</script>
<style>
	.ql-editor.ql-blank:before,
	.ql-editor{
	  font-style: normal;
	}
</style>
<style lang="less" scoped>
	
.post {
	width: 100vw;
	height: 100vh;
	background-color: #f1f6f9;
	
}
.header {
	width: 100%;
	padding: 15px;
	box-sizing: border-box;
	background-color: #FFFFFF;
	.textarea{
		height: 300rpx!important;
		width: 100%;
		margin-bottom: 10px;
		overflow: scroll;
	}
	.menu {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 60px;
		.img {
			width: 30px;
			height: 30px;
			margin: 0 10px;
		}
	}
}
.right {
	position: absolute;
	right: 0;
	display: flex;
	align-items: center;
	padding: 5px 10px;
	background-color: #EEEEEE;
	border-radius: 30px;
	font-size: 13px;
	color: #999999;
	.rightItem {
		width: 20px;
		height: 20px;
		margin: 0 10px 0 0;
	}
}
.btn {
	width: calc(100% - 30px);
	margin: 30px 0 30px 15px;
	height: 50px;
	text-align: center;
	line-height: 50px;
	border-radius: 50px;
	color: #FFFFFF;
	font-size: 16px;
	background: linear-gradient(to right, #FE9F02 , #F30D15);
}

</style>
