(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/Login/Index"],{"1b9b":function(t,e,n){"use strict";n.r(e);var r=n("50f4"),a=n("4e3b");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);n("9034");var u,i=n("f0c5"),c=Object(i["a"])(a["default"],r["b"],r["c"],!1,null,"39025ae8",null,!1,r["a"],u);e["default"]=c.exports},"4e3b":function(t,e,n){"use strict";n.r(e);var r=n("6f01"),a=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);e["default"]=a.a},"50f4":function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return r}));var a=function(){var t=this,e=t.$createElement;t._self._c},o=[]},"6f01":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=u(n("a34a")),a=n("7bef"),o=u(n("79fc"));u(n("030c"));function u(t){return t&&t.__esModule?t:{default:t}}function i(t,e){return l(t)||d(t,e)||f(t,e)||c()}function c(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function f(t,e){if(t){if("string"===typeof t)return s(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(t,e):void 0}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function d(t,e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,a=!1,o=void 0;try{for(var u,i=t[Symbol.iterator]();!(r=(u=i.next()).done);r=!0)if(n.push(u.value),e&&n.length===e)break}catch(c){a=!0,o=c}finally{try{r||null==i["return"]||i["return"]()}finally{if(a)throw o}}return n}}function l(t){if(Array.isArray(t))return t}function h(t,e,n,r,a,o,u){try{var i=t[o](u),c=i.value}catch(f){return void n(f)}i.done?e(c):Promise.resolve(c).then(r,a)}function v(t){return function(){var e=this,n=arguments;return new Promise((function(r,a){var o=t.apply(e,n);function u(t){h(o,r,a,u,i,"next",t)}function i(t){h(o,r,a,u,i,"throw",t)}u(void 0)}))}}var p={name:"Login",data:function(){return{userId:"8120118001",password:"88888888",errTip:null}},created:function(){(0,a.showLoading)();var e=this.$http.checkToken();t.hideLoading(),e&&this.toIndexPage()},methods:{toLogin:function(){var e=this;return v(r.default.mark((function n(){var u,c,f,s,d,l,h,v,p,b;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return(0,a.showLoading)(),e.checkInfo(),n.next=4,t.login();case 4:return u=n.sent,c=i(u,2),c[0],f=c[1],n.next=10,o.default.login(e.userId,e.password);case 10:if(s=n.sent,d=i(s,2),l=d[0],h=d[1],e.$http.errorCheck(l,h)){n.next=16;break}return n.abrupt("return",!1);case 16:return n.next=18,o.default.openId(e.userId,f.code);case 18:v=n.sent,p=i(v,2),p[0],b=p[1],b.data.data.checkResult,(0,a.setStorage)("userInfo",h.data.data),h.data.data.isLogin,t.hideLoading(),e.toIndexPage();case 27:case"end":return n.stop()}}),n)})))()},checkInfo:function(){if(!this.password&&!this.userId)return this.errTip="请填写密码",!1;this.errTip=""},toIndexPage:function(){(0,a.toPage)("/pages/Leave/Leave","switchTab")}}};e.default=p}).call(this,n("543d")["default"])},9034:function(t,e,n){"use strict";var r=n("fb66"),a=n.n(r);a.a},a68c:function(t,e,n){"use strict";(function(t){n("9a90");r(n("66fd"));var e=r(n("1b9b"));function r(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},fb66:function(t,e,n){}},[["a68c","common/runtime","common/vendor"]]]);