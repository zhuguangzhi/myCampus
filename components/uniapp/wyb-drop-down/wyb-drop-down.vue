<template>
	<view 
	 class="wyb-drop-down-box"
	 :style="{
		 '--duration': duration + 'ms',
		 '--autoContentTop': autoContentTop}">
		
		<view class="wyb-drop-down-container" @tap.stop.prevent @touchmove.stop.prevent>
			<view 
			 class="wyb-drop-down-header"
			 :style="{
				 zIndex: zIndex,
				 backgroundColor: bgColor.header}">
				<view 
				 class="wyb-drop-down-header-item"
				 @tap.stop="onHeaderTap()"
				 :style="{fontSize: fontSize.header + 'rpx'}">
					<text
					 class="wyb-drop-down-header-item-label">当前：{{options[contentActiveIndexList]['className']}}-{{options[contentActiveIndexList]['courseName']}}</text>
					<text
					 v-if="dropIcon === 'fill'"
					 class="iconfont icon-down-fill wyb-drop-down-header-item-icon"
					 :class="[dropOver ? 'wyb-drop-down-header-item-icon-active' : '']"
					 :style="{
						 fontSize: fontSize.header - 5 + 'rpx',
					}" />
					<text
					 v-if="dropIcon==='line'"
					 class="iconfont icon-down wyb-drop-down-header-item-icon"
					 :class="[dropOver ? 'wyb-drop-down-header-item-icon-active' : '']"
					 :style="{
						 fontSize: fontSize.header - 5 + 'rpx',
						 transformOrigin: '50% 45%',
					}" />
				</view>
			</view>
			
			<scroll-view 
			 v-if="dropDown"
			 class="wyb-drop-down-content" 
			 :class="[dropOver ? 'wyb-drop-down-content-active' : '']"
			 :scroll-y="scroll"
			 :enable-flex="true"
			 :scroll-anchoring="true"
			 :style="{
				 zIndex: zIndex - 1,
				 fontSize: fontSize.content + 'rpx',
				 backgroundColor: bgColor.content,
				 borderBottomLeftRadius: radius + 'px',
				 borderBottomRightRadius: radius + 'px',
				 minHeight: minHeight + 'rpx',
				 height: autoHeight ? 'auto' : minHeight + 'rpx',
				 maxHeight: autoHeight && maxHeight ? maxHeight + 'rpx' : 'auto'
				}"
			>
				 <view class="wyb-drop-down-content-box" >
					<view
					 class="wyb-drop-down-content-item"
					 v-for="(content,zIndex) in options"
					 :key="zIndex"
					 @tap.stop="onContentItemsTap(zIndex)">
						<text
						 class="wyb-drop-down-content-item-label"
						 :style="{color: contentActiveIndexList === zIndex && dropOver ? activeColor: defaultColor}">
							{{content['className']}}：{{content['courseName']}}
						</text>
						<text
						 v-if="contentActiveIndexList === zIndex && dropOver"
						 :style="{color: activeColor}"
						 class="iconfont icon-selected wyb-drop-down-content-item-icon" />
						
					</view>
				 </view>
			</scroll-view>
		</view>
		
		<view
		 v-if="dropDown"
		 class="wyb-drop-down-mask"
		 :class="[dropOver ? 'wyb-drop-down-mask-active' : '']"
		 @tap.stop="close"
		 @touchmove.stop.prevent
		 :style="{
			 zIndex: zIndex - 2,
			 height: screenHeight + 'px',
			 backgroundColor: 'rgba(0, 0, 0, ' + maskAlpha + ')'}" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dropDown: false,
				dropOver: false,
				duration: 500,
				contents: this.options[0] || [0],
				headerActiveIndex: 0,
				contentActiveIndexList: 0
			}
		},
		computed: {
			autoContentTop() {
				return `${44 + this.rpxToPx(100)}px`
			},
			screenHeight() {
				return uni.getSystemInfoSync().screenHeight
			},
			screenWidth() {
				return uni.getSystemInfoSync().screenWidth
			},
			contentBoxKey() {
				return function(index) {
					return `option${index}`
				}
			}
		},
		props: {
			options: Array,
			defaultIndexList: {
				type: Object,
				default() {
					return {}
				}
			},
			autoHeight: {
				type: Boolean,
				default: true
			},
			minHeight: {
				type: [String, Number],
				default: 10
			},
			maxHeight: {
				type: [String, Number],
				default: 600
			},
			scroll: {
				type: Boolean,
				default: true
			},
			radius: {
				type: [String, Number],
				default: '0'
			},
			activeColor: {
				type: String,
				default: '#2979ff'
			},
			activeWeight: {
				type: Boolean,
				default: true
			},
			defaultColor: {
				type: String,
				default: '#333'
			},
			bgColor: {
				type: Object,
				default() {
					return {
						header: '#fff',
						content: '#fff'
					}
				}
			},
			dropIcon: {
				type: String,
				default: 'line'
			},
			fontSize: {
				type: Object,
				default() {
					return {
						header: 30,
						content: 30
					}
				}
			},
			maskAlpha: {
				type: [String, Number],
				default: '0.5'
			},
			zIndex: {
				type: Number,
				default: 500
			}
		},
		
		methods: {
			onHeaderTap() {
				if (Object.is(this.headerActiveIndex, 0) && this.dropOver) {
					this.dropOver=false;
					// this.dropDown = false;
					this.close()
				} else {
					this.headerActiveIndex = 0
					this.dropDown = true
					this.$nextTick(() => {
						this.dropOver = true
						this.$emit('show')
					})
				}
			},
			onContentItemsTap(index) {
				this.contentActiveIndexList = index
				this.$forceUpdate()
				this.$emit('select', index)
				this.close()
			},
			close() {
				this.dropOver = false
				setTimeout(() => {
					this.dropDown = false
					this.$emit('hide')
				}, this.duration)
			},
			rpxToPx(rpx) {
				return rpx / 750 * this.screenWidth
			}
		}
	}
</script>

<style>
	@import './iconfont.css';
	.wyb-drop-down-mask {
		position: fixed;
		top: 44px;
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		left: 0;
		bottom: 0;
		right: 0;
		opacity: 0;
		transition: opacity var(--duration);
		z-index: 8;
	}
	
	.wyb-drop-down-mask-active {
		opacity: 1;
		transition: opacity var(--duration);
	}
	
	.wyb-drop-down-header {
		position: fixed;
		top: 44px;
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		left: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		background-color: #fff;
		z-index: 10;
	}
	
	.wyb-drop-down-header-item {
		flex: 1;
		height: 100rpx;
		font-size: 30rpx;
		border-bottom: 1px solid #eee;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.wyb-drop-down-header-item-label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}
	
	.wyb-drop-down-header-item-icon {
		margin-left: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		transform-origin: 50% 40%;
		transform: rotate(0);
		transition: transform var(--duration);
	}
	
	.wyb-drop-down-header-item-icon-active {
		transform: rotate(180deg);
		transition: transform var(--duration);
	}
	
	.wyb-drop-down-content {
		position: fixed;
		top: var(--autoContentTop);
		/* #ifndef H5 */
		top: 100rpx;
		/* #endif */
		left: 0;
		right: 0;
		z-index: 9;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background-color: #fff;
		transform: translateY(-100%);
		transition: transform var(--duration);
	}
	
	.wyb-drop-down-content-active {
		transform: translateY(0);
		transition: transform var(--duration);
	}
	
	.wyb-drop-down-content-item {
		width: 100%;
		height: 100rpx;
		font-size: 30rpx;
		display: flex;
		flex-direction: column;
		position: relative;
	}
	
	.wyb-drop-down-content-item-label {
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding-left: 50rpx;
		border-bottom: 0.5px solid #EEEEEE;
	}
	
	.wyb-drop-down-content-item-icon {
		position: absolute;
		top: 50%;
		right: 40rpx;
		font-size: 40rpx;
		transform: translateY(-50%);
	}
	
	.wyb-drop-down-content-box {
		width: 100%;
	}
	
	.wyb-drop-down-content-slot {
		width: 100%;
		height: 100%;
	}
	
	.wyb-drop-down-vline {
		width: 1px;
		height: 40rpx;
		background-color: #eee;
		position: absolute;
		right: 0;
	}

</style>
