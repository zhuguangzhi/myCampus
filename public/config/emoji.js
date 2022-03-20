var url = 'https://www.xiaopang.cool/public/imgs/'
const pngList=[ //糗事表情png
		[0, 1, 2, 3, 4, 5, 6],
		[7, 8, 9, 10, 11, 12, 13],
		[14, 15, 16, 17, 18, 19, 20],
		[21, 22, 23, 24, 25, 26, 27],
		[28, 29, 30, 31, 32, 33, 34],
		[35, 36, 37, 38, 39, 40, 41],
		[42, 43, 44, 45, 46, 47, 48],
		[49, 50, 51, 52, 53, 54, 55],
		[56, 57, 58, 59, 60, 61, 62]
	]
const gifList=[ //全部表情jif
		[100, 101, 102, 103, 104, 105, 106],
		[107, 108, 109, 110, 111, 112, 113],
		[114, 115, 116, 117, 118, 119, 120],
		[121, 122, 123, 124, 125, 126, 127],
		[128, 129, 130, 131, 132, 133, 134],
		[135, 136, 137, 138, 139, 140, 141],
		[142, 143, 144, 145, 146, 147, 148],
		[149, 150, 151, 152, 153, 154, 178],
		[179, 180, 181, 182, 183, 184, 185],
		[186, 187, 188, 189, 242, 243, 244],
		[245, 246, 247, 248, 249, 250, 251],
		[252, 253, 270, 271, 272, 273, 274],
		[275, 276, 277, 278, 279, 280, 281],
		[282, 283, 284, 285, 286, 287, 288],
		[289, 290, 291, 292, 293, 294, 295],
		[296, 297, 298, 299, 300, 301, 302],
		[303, 304, 305, 306, 307, 308, 309],
		[310, 311, 312, 313, 314]
	]
	// 图片的服务器地址
const pngUrl=function() {
	let arr = [];
	let child = [];
	let list = pngList;
	for (let item of list) {
		child = [];
		for (let key of item) {
			child.push(url + key + '.png');
		}
		arr.push(child);
	}
	return arr;
}
// gif 图片不清晰舍弃
const gifUrl=function() {
	let arr = [];
	let child = [];
	let list = gifList;
	
	for (let item of list) {
		child = [];
		for (let key of item) {
			child.push(url + key + '.gif');
		}
		arr.push(child);
	}
	return arr;
}
export {
	pngList,
	gifList,
	pngUrl,
	// gifUrl
}
