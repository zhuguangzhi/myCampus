<template>
	<dynamic/>
</template>

<script>
import dynamic from './commponents/dynamicBox.vue'
import { toPage} from '@/public/common/baseFn.js';
export default {
	components:{
		dynamic
	},
	data(){
		return {
			tabClick: false,
		}
	},
	onTabItemTap(e) {
		this.$nextTick(() => {
			if (this.tabClick) {
				// 200ms 内再次点击
				toPage('/pages/Dynamic/CreateDynamic');
			}
			this.tabClick = true;
			setTimeout(() => {
				this.tabClick = false; // 200ms 内没有第二次点击，就当作单击
			}, 200);
		});
	},
};
</script>

