export function formatDate(date, fmt) {
  var currentDate = new Date(date);
  var o = {
    "M+": currentDate.getMonth() + 1, //月份
    "d+": currentDate.getDate(), //日
    "h+": currentDate.getHours(), //小时
    "m+": currentDate.getMinutes(), //分
    "s+": currentDate.getSeconds(), //秒
    "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
    "S": currentDate.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
export function timediff(begin_time,end_time)
    {
		let starttime =begin_time;
		let endtime = end_time;
		let timediff = endtime-starttime;
		let y=0,M=0,d=0;
		//计算小时数
		let hours = Math.floor(timediff/(3600 * 1000));
		let h = hours;
		while ((hours - 24*365)>=0){
		    y+=1;
		    hours -= 24*365;
		}
		while ((hours - 24*31)>=0){
		    M+=1;
		    hours -= 24*31;
		}
		while ((hours - 24)>=0){
		    d+=1;
		    hours -= 24
		}
		let arr = [];
		arr.push(y,M,d,hours)
		let msg  = ['年','月','天','时']
		let res = '' ;
		arr.forEach((item,index)=>{
		    if(item!==0) {
		        res += item + msg[index]
		    }
		})
    	return [res,h];
    }