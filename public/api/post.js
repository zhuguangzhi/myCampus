import Request from '../common/request.js'
export default class postServers {
	static createPost(content,limit){
		return Request.post('/createPost',{content,limit},{'token':true})
	}
	// 动态获取
	static getPostList(page,type){
		return Request.get('/getPostList',{page,type},{'token':true})
	}
	// 发评论
	static creatComment(postId,content,replyId){
		return Request.post('/creatComment',{
			postId,content,replyId
		},{'token':true})
	}
	// 评论获取
	static getComment(postId,page){
		return Request.get('/getComment',{
			postId,page
		},{'token':true})
	}
	// 动态收藏
	static collectPost(id){
		return Request.post('/collectPost',{'postId':id},{token:true})
	}
	// 动态收藏移除
	static removePost(postId){
		return Request.delete('/removePost',{postId},{token:true})
	}
	// 删除动态
	static deletePost(id){
		return Request.delete('/deletePost',{id},{token:true})
	}
}