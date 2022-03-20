<template>
	<view class="imgGird" v-if="imgList.length>0">
		<uni-grid ref='grid' :column="column" :show-border="false"  :square="false" >
			<text v-if="hiddenImg===true" class="hiddenImg" @click="showMoreImg()">+{{imgNum}}>></text>
		    <uni-grid-item v-for="(item,index) in showImgList" :key='index' >
				<view :style="girdstyle" class="grid-item-style">
					<image v-if="isImg(item)" :style="imgstyle" mode="aspectFill" :src="item" lazy-load="true" @click="getIndex(index)"/>
					<video class="viedo" v-else :style="imgstyle" :src="item" lazy-load="true" :show-center-play-btn='false' :enable-play-gesture="true" :custom-cache="false" />
					<!-- x号 -->
					<text v-if="issure" class="iconX" @click="removeImg(index)">x</text>
				</view>
		    </uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	import uniGrid from "./uni-grid.vue"
	import uniGridItem from "./uni-grid-item.vue"
	import {previewImage} from "@/public/common/baseFn.js"
	export default {
		props:{
			imgList:Array,
			issure:{
				default:false,
				type:Boolean
			}
		},
		data() {
			return {
				showImgList:[],
				column:1,//*
				imgstyle:'',
				girdstyle:'',
				hiddenImg:false,
				imgNum:'',
				imgPatternList:['png', 'jpg', 'jpeg', 'bmp', 'gif'],//图片格式列表
				
			};
		},
		watch:{
			imgList(info,oldInfo){
				this.$nextTick(function(){
					this.setImg();
					if(this.$refs.grid!=undefined){
						this.$refs.grid.init();
					}
				})
			}
		},
		components: {uniGrid,uniGridItem},
		mounted() {
			this.setImg();
		},
		computed:{
			// 判断是否是图片
			isImg (){
				return (urlInfo)=>{
					// 进行图片匹配
					let pattern = urlInfo.slice(urlInfo.lastIndexOf('.')+1);
					let result = this.imgPatternList.some(function (item) {
						return item == pattern;
					});
					return result;
				}
				
			}
		},
		methods:{
			// 图片预览
			getIndex(index){
				previewImage(index,this.showImgList);
			},
			// 展示跟多图片
			showMoreImg(){
				for (const item of this.imgList) {
					this.showImgList.push(item)
				}
				this.hiddenImg=false;
			},
			setImg(){
				// 设置图片九宫格
				this.imgList.length===1?this.column=1:this.imgList.length===2||this.imgList.length===4?this.column=2:this.column=3;
				if (this.imgList.length===2||this.imgList.length===4 || this.imgList.length===1) {
					this.column=2;
					this.girdstyle="height:332rpx;";
					this.imgstyle="height:332rpx;margin-left: 50%;transform: translateX(-50%);";
				}else {
					this.column=3;
					this.girdstyle="height:221.3rpx;";
					this.imgstyle="height:221.3rpx;margin-left: 50%;transform: translateX(-50%);";
				};
				// 发布动态和详情页时，图片无显示限制
				if(this.issure){
					this.showImgList=this.imgList
				}else{
					// 当图片数量大于9时，隐藏图片(浏览动态时)
					// 大于9时只返回0-8的字符
					if (this.imgList.length>9){
						this.showImgList=this.imgList.splice(0,9);
						this.imgNum=this.imgList.length;
						this.hiddenImg=true;
					}else{
						this.showImgList=this.imgList;
						this.hiddenImg=false;
					}
				}
				
			},
			// 删除图片
			removeImg(index){
				this.$emit('remove',index);
			}
		}
	}
</script>

<style lang="less">
	.imgGird {
		position:relative;
	}
	image {
		margin-top: 5rpx;
	}
	.viedo {
		width: 100%;
	}
	.grid-item-style {
		position: relative;
		margin: 0 3rpx;
		overflow: hidden;
		
	}
	.hiddenImg{
		position: absolute;
		bottom: 0;
		right: 0;
		height:219.3rpx;
		width: calc(100%/3 - 8rpx);
		margin-right: 8rpx;
		background-color: rgba(0,0,0,.3);
		color: #fff;
		text-align: center;
		line-height: 219.3rpx;
		font-size: 50rpx;
		z-index: 3;
	}
	// x号
	.iconX {
		position: absolute;
		display: block;
		background-color: rgba(#000000,0.4);
		color: rgba(#ffffff,0.7);
		width: 20px;
		height: 20px;
		top: 4rpx;
		right: 0px;
		text-align: center;
		line-height: 16px;
		border-radius:  0 0 0 7px;
		font-size: 12px;
		z-index: 2;
	}
</style>
