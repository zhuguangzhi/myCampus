<template>
	<view class="">
		<mescroll-uni  @init="mescrollInit" @up="loadMore" @down="refresh" :down="downOption" :up="upOption" height="100%" BGC="#F1F6F9">
			<mescroll-empty v-if="postList.length==0"></mescroll-empty>
			<view class="dynamic" @click="deletePost(item.id,index)"  v-else  v-for="(item, index) in postList" :key="index">
				<view class="header">
					<!-- 头像 -->
					<image
						class="img"
						src="https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLICxO04k0gib971cQEkyEqZO3xChscnWOP3tQlGRBnBqxuPYtOWVo5KhLQ3XLKJQjGYgeaBkCXQYQ/132"
						mode=""
					></image>
					<!-- 名字 -->
					<text class="name">{{ item.postUser.nick_name || item.postUser.name }}</text>
				</view>
				<view class="content">
					<rich-text class="richText" :nodes="item.content"></rich-text>
					<img-grid class="grid" :imgList="item.imgList"></img-grid>
					<!-- imgGrid -->
				</view>
				<view class="bottom">
					<!-- 评论 -->
					<view class="comment" @click.stop="tapComment(index)">
						<!-- img -->
						<image style="margin-top: -2px;" class="svg" :src="commentUrl" mode=""></image>
						{{ item.post_num>0?item.post_num:'' }}
					</view>
					<!-- 收藏 -->
					<image @click.stop="collectPost(item.id)" v-if="routeType==='dynamic'" class="svg" :src="item.is_collect!=null?collectUrl[1]:collectUrl[0]" mode=""></image>
					<!-- 发布日期 -->
					<text class="time">{{ item.time }}</text>
				</view>
			</view>
		</mescroll-uni>
		
		<comment v-if="showComment" :postInfo="postList[postIndex]" :postNum="postList[postIndex].post_num"></comment>
	</view>
</template>

<script>
import ImgGrid from '@/components/ImgGrid/imgGird.vue';
import { toPage, showLoading,message,showModel } from '@/public/common/baseFn.js';
import postServers from '@/public/api/post.js';
import BaseConfig from '@/public/config/BaseConfig.js';
import comment from '../comment/comment.vue';
export default {
	name: 'Dynamic',
	components: {
		ImgGrid,
		comment
	},
	props:{
		routeType:{
			type:String,
			default:"dynamic"
		}
	},
	data() {
		return {
			downOption: {
				use: true,
				auto: true
			},
			upOption: {
				use: true,
				auto: false,
				isBounce: true,
				page: { num: this.page, size: 10 },
				isBounce: true,
				noMoreSize:1
			},
			mescroll: null,
			
			postList: [],
			page: 1,
			showComment: false,
			postIndex:-1,

			commentUrl: '/static/img/iconfont/comment.svg',
			collectUrl: ['/static/img/iconfont/collect.svg', '/static/img/iconfont/iscollect.svg']
		};
	},
	mounted() {
		// showLoading('数据加载中...');
	},
	methods: {
		mescrollInit(e) {
			this.mescroll = e;
		},
		// 数据获取
		async getDynamicList() {
			let [err, res] = await postServers.getPostList(this.page,this.routeType);
			uni.hideLoading()
			if (!this.$http.errorCheck(err, res)) return false;
			let data = res.data.data;
			this.mescroll.endSuccess(data.data.length);
			this.mescroll.endBySize(data.data.length, data.total);
			return data.data;
		},
		// 下拉刷新
		async refresh() {
			this.page = 1;
			let data = await this.getDynamicList();
			let arr = []
			data.forEach(item => {
				item['imgList'] = [];
				if (item.image_list != null) {
					item.image_list.forEach(img => {
						item['imgList'].push(BaseConfig.staticUrl + img.url);
					});
				}
				arr.push(item)
			});
			this.postList = arr;
			
		},
		// 上拉加载
		async loadMore() {
			this.page += 1;
			let data = await this.getDynamicList();
			data.forEach(item => {
				item['imgList'] = [];
				if (item.image_list != null) {
					item.image_list.forEach(img => {
						item['imgList'].push(BaseConfig.staticUrl + img.url);
					});
				}
				this.postList.push(item);
			});
		},
		tapComment(index = null) {
			this.showComment = !this.showComment;
			this.postIndex = index
		},
		// 收藏动态
		async collectPost(id){
			let [err,res] = await postServers.collectPost(id)
			if(!this.$http.errorCheck(err,res)) return false
			message("收藏成功");
		},
		async deletePost(id,index){
			if(this.routeType==='dynamic') return false
			let content = this.routeType==="dynamicCollect"?"移出收藏":"确定删除该动态吗？"
			let [err,res] = await showModel(content);
			if(res.confirm){
				// 移除
				this.postList.splice(index,1)
				switch(this.routeType){
					case "dynamicCollect":
						await postServers.removePost(id);
						break;
					case "mySpace":
						await postServers.deletePost(id);
					
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '/static/css/base.css';
.dynamic {
	width: calc(100vw - 30px);
	margin: 10px 0 0 15px;
	border: border;
	padding: 10px;
	box-sizing: border-box;
	border-radius: 15px;
	background-color: #ffffff;
}
.header {
	width: 100%;
	height: 60px;
	display: flex;
	align-items: center;
	.img {
		display: inline-block;
		width: 40px;
		height: 40px;
		margin-right: 10px;
		border-radius: 40px;
	}
	.name {
		font-size: 16px;
		color: #666666;
	}
}
.content {
	width: 100%;
	.richText {
		display: inline-block;
		width: 100%;
		line-height: 30px;
		max-height: 400rpx;
		overflow-y: scroll;
		font-size: 16px;
		vertical-align: middle;
	}
	.grid {
		width: 100%;
		margin: 10px 0 20px 0;
		display: block;
	}
}
.bottom {
	position: relative;
	width: 100%;
	height: 30px;
	display: flex;
	align-items: center;
	color: #999999;
	.svg {
		width: 16px;
		height: 16px;
		vertical-align: middle;
		display: inline-block;
		margin-right: 10px;
	}
	.comment {
		margin-right: 15px;
	}
	.time {
		position: absolute;
		right: 0;
	}
}
</style>
