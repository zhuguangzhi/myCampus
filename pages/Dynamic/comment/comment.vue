<template>
	<!-- <view class="comment" :class="isClose === true ? 'openComment' : 'closeComment'" @click="closeComment()"> -->
	<view class="comment openComment"  @click="closeComment()">
		<view class="scroll" @click.stop="useEmoji=false">
			<mescroll-uni @init="mescrollInit" @up="loadMore" :down="downOption" :up="upOption" height="70%" >
				<mescroll-empty v-if="list.length==0"></mescroll-empty>
				<view class='content' v-else v-for="(item,index) in commentList" :key="index">
					<view class="userInfo">
						<!-- 头像 -->
						<image @click="toUserInfo" class="userphoto" :src="item.commentInfo.avatarUrl"></image>
						<!-- 姓名、日期 -->
						<view class="nameAndTime">
							<text class="userName">{{item.commentInfo.nick_name || item.commentInfo.name}}</text>
							<text class="commentTime">{{item.time}}</text>
						</view>
					</view>
					<view class="contentInfo">
						<rich-text :nodes="item.content"></rich-text>
					</view>
				</view>
			</mescroll-uni>
			<view class="editorPanle" @click.stop=''>
				<view class="" :style="{bottom:emojiHeight}">
					<editor id="editor"
						class="editor" 
						placeholder="说点什么吧~"
						:read-only="readOnly"
						@ready="onEditorReady"
						@click="useEmoji=false"
					>
					</editor>
					<image @click="tapEmoji()" class="emojiLine" src="/static/img/iconfont/emojiLine.svg" mode=""></image>
					<button type="default" class="btn" @click="creatComment()">发送</button>
				</view>
				<!-- 表情 -->
				<emoji :useEmoji="useEmoji" @choseEmoji="choseEmoji"></emoji>
			</view>
		</view>
		<!-- <view v-if="!openKeyBoard" class="commentBox" @click.stop="createComment()">
			<text class="inputBox">说点什么吧~</text>
		</view> -->
		
	</view>
</template>

<script>
import emoji from '@/components/emoji.vue'
import userConfig from '@/public/config/user.js'
import {toPage,showLoading} from '@/public/common/baseFn.js'
import postServers from '@/public/api/post.js'
export default {
	components:{
		emoji
	},
	props:{
		postInfo:Object,
		postNum:Number
	},
	data() {
		return {
			downOption: {
				use: false
			},
			upOption: {
				use: true,
				auto: false,
				isBounce: true,
				page: { num: this.page, size: 10 },
				isBounce: true,
				noMoreSize: 1
			},
			page: 1,
			commentScroll: null,
			editorCtx:null,
			readOnly:false,
			useEmoji:false,//使用表情
			emojiHeight:0,//表情高度
			
			post:this.postInfo,//文章的具体详情
			commentList:[],//评论+回复
			commentPage:1,//评论页数
			
		};
	},
	watch:{
		useEmoji(val){
			if(val===false){
				this.editorCtx.getContents({
					success:(res)=>{
						this.editorCtx.setContents({
							html:res.html.replace(new RegExp('(<p><br></p>)+'),''),
							success:()=>{
								this.readOnly=false
							}
						})
					}
				})
				this.emojiHeight='0'
			}
			else {
				this.readOnly=true
			}
		}
	},
	mounted() {
		if(this.postNum===0) return;
		showLoading('数据获取中...');
		this.getComment(this.commentPage);
	},
	methods: {
		// 获取评论
		async getComment(){
			let[err,res] = await postServers.getComment(this.post.id,this.commentPage);
			uni.hideLoading()
			if(!this.$http.errorCheck(err,res)) return false;
			let data = res.data.data;
			data.data.forEach((item)=>{
				this.commentList.push(item)
			})
			console.log(data.data)
			this.commentScroll.endSuccess(data.data.length);
			this.commentScroll.endBySize(data.data.length, data.total);
		},
		mescrollInit(e) {
			this.commentScroll = e;
		},
		// 编辑器初始 组件中需要this.createSelectorQuery()来代替uni.createSelectorQuery()
		onEditorReady(){
			this.createSelectorQuery().select('#editor').context((res) => {
				this.editorCtx = res.context
			}).exec()
		},
		
		closeComment(){
			this.$parent.tapComment()
		},
		// 选择表情
		choseEmoji(item,id){
			this.editorCtx.insertImage({
				src:item,
				extClass:"emojiSize", 
			})
		},
		tapEmoji(){
			this.useEmoji=!this.useEmoji
			if(this.useEmoji){
				this.emojiHeight='500rpx'
			}
		},
		// 下拉加载
		loadMore(){
			this.commentPage+=1;
			this.getComment()
		},
		// 发评论(回复文章)
		async creatComment(){
			this.useEmoji=false;
			let content = await this.editorCtx.getContents()
			content.html=content.html.replace(new RegExp('(<p><br></p>)+'),'')
			let reg = new RegExp('[\u4e00-\u9fa5|a-zA-Z|0-9]','g')
			if(!reg.test(content.text)){
				message('请说点什么吧~')
				return false;
			}
			showLoading('回复中...');
			setTimeout(()=>{
				uni.hideLoading()
				api()
			},200)
			let that = this;
			async function api(){
				let[err,res] = await postServers.creatComment(that.post.id,content.html,that.post.user_id)
				uni.hideLoading()
				if(!that.$http.errorCheck(err,res)) return false;
				that.editorCtx.setContents({
					html:'',
				})
				if(that.commentList.length<11){
					let userInfo = userConfig.userInfo;
					let myDate = new Date();
					that.commentList.unshift({
						'commentInfo':{
							'nick_name':userInfo.nick_name,
							'name':userInfo.name,
							'avatarUrl':userInfo.avatarUrl
						},
						'time':myDate.getHours()+':'+myDate.getMinutes(),
						'user_id':userInfo.userId,
						'content':content.html
					})
				}
			}
			
		},
	}
};
</script>

<style>
	.ql-editor.ql-blank:before,
	.ql-editor{
	  font-style: normal!important;
	}
</style>
<style lang="less" scoped>
	@import '/static/css/base.css';
.comment {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100vw;
	z-index: 2;
}
.scroll {
	position: absolute;
	width: 100%;
	height: calc(70% + 20px);
	bottom: 60px;
	left: 0;
	background-color: #ffffff;
	border-radius: 20px 20px 0 0;
	padding: 20px 10px 0 10px;
	box-sizing: border-box;
	box-shadow: 0 0 9px 0px rgba(0, 0, 0, 0.3);
}
.commentBox {
	position: absolute;
	width: 100%;
	height: 50px;
	bottom: 0;
	left: 0;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	padding: 7px 15px;
	box-sizing: border-box;
	.inputBox {
		width: 20%;
		flex: 1;
		background-color: #EEEEEE;
		color: #999999;
		font-size: 14px;
		box-sizing: border-box;
		height: 36px;
		line-height: 36px;
		padding: 0 10px;
		border-radius: 36px;
	} 
	
}
.emojiLine {
		width: 25px;
		height: 25px;
		margin: 0 10px;
	}
.openComment {
	height: 100vh;
	// transition: 0.15s linear;
}
.closeComment {
	visibility: hidden;
	height: 0 !important;
	// transition: 0.15s linear;
}
.userInfo {
	display: flex;
	position: relative;
	align-items: center;
	width: 100%;
	height: 30px;
	padding: 10px 0;
	// background-color: red;
}
.userphoto {
	width: 35px;
	height: 35px;
	border-radius: 40px;
}
.nameAndTime {
	height: 35px;
	margin-left: 5px;
	.userName,
	.commentTime{
		line-height: 18px;
		display: block;
		font-size: 14px;
		color: #9C9C9C;
	}
	.commentTime{
		padding-top: 5px;
		font-size: 12px;
		color: #D0D0D0;
	}
}
.contentInfo {
	width: calc(100% - 40px);
	padding-left: 40px;
	padding-bottom: 10px;
	border-bottom: 0.3rpx solid #f0f0f0 ;
}
.editorPanle {
	position: fixed;
	bottom: 0;
	width: 100vw;
	margin-left: -10px;
	min-height: 40px;
	max-height: 500rpx;
	z-index: 9;
	view {
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 40px;
		background-color: #FFFFFF;
		padding: 10px;
		.editor {
			width: 20%;
			min-height: 40px;
			max-height: 40px;
			height: 40px;
			border-radius: 20px;
			padding: 10px;
			flex: 1;
			background-color: ;
			background-color: #EEEEEE;
		}
		.btn {
			padding: 0 10px;
			margin-right: 20px;
			line-height: 30px;
			height: 30px;
			background-color: var(--color);
			color: #FFFFFF;
			font-size: 16px;
		}
	}
}
</style>

