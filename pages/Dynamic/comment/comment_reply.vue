<!-- 本页是评论+回复，由于小程序性能及ui设计，暂不使用 -->
<template>
	<!-- <view class="comment" :class="isClose === true ? 'openComment' : 'closeComment'" @click="closeComment()"> -->
	<view class="comment openComment"  @click="closeComment()">
		<view class="scroll" @click.stop="useEmoji=false">
			<mescroll-uni @init="mescrollInit" @up="loadMore" :down="downOption" :up="upOption" height="70%" >
				<mescroll-empty v-if="list.length==0"></mescroll-empty>
				<view class='content' v-else v-for="(item,index) in list" :key="index">
					<image class="userphoto" :src="item.commentInfo.commentInfo.avatarUrl"></image>
					<view class="commentData">
						<view class="header">
							<text class="name">{{item.commentInfo.commentInfo.nick_name || item.commentInfo.commentInfo.name}}</text>
							<text class="time">{{item.commentInfo.time}}</text>
						</view>
						<view class="contentText" @click="creatReply(item.commentInfo)">
							{{item.commentInfo.content}}
						</view>
						<view v-if="item.commentInfo.reply_num>10">
							<text class="showMore" v-if="showReplyExtend !== index">
								展开{{item.commentInfo.reply_num}}条回复∨
							</text>
							<veiw v-else v-for="(reply,key) in item.replyList" class="reply">
								<image class="replyPhoto" :src="photo"></image>
								<view class="commentData">
									<view class="header">
										<text class="name">追分者 <text style="color:#666666">回复</text> 学霸</text>
										<text class="time">2019-12-09</text>
									</view>
									<view class="contentText">
										手机倒过来试试
									</view>
								</view>
							</veiw>
							<!-- 评论的回复者 -->
							<view v-if="showReplyExtend === index && showGetMoreReply" class="showReply">
								<text>展开更多回复</text>
								<text class="hidden">收起∧</text>
							</view>
						</view>
						<veiw v-else class="reply">
							<image class="replyPhoto" :src="photo"></image>
							<view class="commentData">
								<view class="header">
									<text class="name">追分者 <text style="color:#666666">回复</text> 学霸</text>
									<text class="time">2019-12-09</text>
								</view>
								<view class="contentText">
									手机倒过来试试
								</view>
							</view>
						</veiw>
					</view>
				</view>
			</mescroll-uni>
			<view class="editorPanle" @click.stop=''>
				<view class="" :style="{bottom:emojiHeight}">
					<editor id="editor"
						class="editor" 
						:placeholder="editorPlaceholder"
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
import {toPage,showLoading} from '@/public/common/baseFn.js'
import postServers from '@/public/api/post.js'
export default {
	components:{
		emoji
	},
	props:{
		postInfo:Object
	},
	data() {
		return {
			downOption: {
				use: false
			},
			upOption: {
				use: false,
				auto: false,
				isBounce: true,
				page: { num: this.page, size: 10 },
				isBounce: true,
				noMoreSize: 1
			},
			page: 1,
			commentScroll: null,
			editorPlaceholder:'说点什么吧~',
			editorCtx:null,
			readOnly:false,
			useEmoji:false,//使用表情
			emojiHeight:0,//表情高度
			
			post:this.postInfo,//文章的具体详情
			list:[
				// {
				// 	commentInfo:{},
				// 	replyInfo:[],
				// }
			],//评论+回复
			showReplyExtend:-1,//展开评论的回复
			showGetMoreReply:false,// 获取更多回复
			commentId:0,//回复的评论id 0 则是发布评论
			commentPage:1,//评论页数
			// ---------------
			photo:'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
			
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
		showLoading('数据获取中...');
		this.getComment(this.commentPage);
	},
	methods: {
		// 获取评论/回复
		async getComment(page=1,fId=0){
			let[err,res] = await postServers.getComment(this.post.id,page,fId);
			uni.hideLoading()
			if(!this.$http.errorCheck(err,res)) return false;
			let data = res.data.data;
			if(fId === 0){
				// 获取评论
				data.data.forEach((item)=>{
					this.list.push({
						'commentInfo':item,
						'replyList':[],
						'replyPage':1
					})
				})
				console.log(this.list)
				this.commentScroll.endSuccess(data.data.length);
				this.commentScroll.endBySize(data.data.length, data.total);
			}
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
		// 发评论(回复文章)
		async creatComment(){
			this.useEmoji=false;
			let res = await this.commentApi();
			if(res) {
				this.editorCtx.setContents({
					html:'',
				})
			}
		},
		// 回复（回复评论）
		// async creatReply(item){
		// 	console.log(item)
		// 	let name = item.commentInfo.nick_name || item.commentInfo.name
		// 	console.log(name)
		// 	this.editorPlaceholder="回复："+ name
		// 	this.commentId = item.commentInfo.id
		// 	let res = await this.commentApi()
		// 	if(res) {
		// 		this.editorCtx.setContents({
		// 			html:'',
		// 		})
		// 	}
		// },
		// 评论、回复api
		async commentApi(){
			let content = await this.editorCtx.getContents()
			let reg = new RegExp('[\u4e00-\u9fa5|a-zA-Z|0-9]','g')
			if(!reg.test(content.text)){
				message('请说点什么吧~')
				return false;
			}
			showLoading('回复中...');
			let[err,res] = await postServers.creatComment(this.post.id,content.html,this.post.user_id,this.commentId)
			uni.hideLoading()
			if(!this.$http.errorCheck(err,res)) return false;
			return true
		}
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
.content {
	display: flex;
	justify-content: space-between;
	.userphoto {
		width: 35px;
		height: 35px;
		border-radius: 35px;
		margin-right: 5px;
	}
	.commentData {
		position: relative;
		width: 50%;
		flex: 1;
		.header {
			position: relative;
			height: 25px;
			font-size: 14px;
			.name {
				color: #007AFF;
			}
			.time {
				position: absolute;
				display: inline-block;
				right: 0;
				color: #999999;
			}
		}
		.contentText {
			margin-bottom: 10px;
			font-size: 15px;
			color: #000000;
			line-height: 23px;
		}
		.reply {
			display: flex;
			justify-content: space-between;
			.replyPhoto {
				width: 30px;
				height: 30px;
				border-radius: 30px;
				margin-right: 5px;
			}
		}
	}
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

.showReply {
	position: relative;
	color: var(--color);
	font-size: 12px;
	.hidden {
		position: absolute;
		right: 0;
	}
}
.showMore {
	display: block;
	color: var(--color);
	font-size: 12px;
}
</style>

