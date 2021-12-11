import Vue from 'vue'
import App from './App'
import Http from './public/common/request.js'
import store from './store'

//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$http = Http
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
