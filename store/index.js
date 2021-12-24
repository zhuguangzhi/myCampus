import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		// 绑定openid时暂存用户信息
		userInfo:{},
	},
    mutations: {
		setUserInfo(state,payload){
			state.userInfo=payload
		},
	},
	getters:{
		// 获得提示信息
		getUserInfo(state){
			return state.userInfo;
		},
		
	}
})
export default store