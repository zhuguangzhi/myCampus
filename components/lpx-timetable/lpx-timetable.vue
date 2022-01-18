<template>
  <view class="timetable">
    <view class="header">
      <view class="header-item" v-for="(item,index) in week" :key="item" :style="{ color: todayWeekIndex === index ? '#4070FF' : 'unset' }">{{ item }}</view>
    </view>

    <view class="main">
      <view class="row" v-for="(item,index) in timetableType" :key="index">
        <view class="time-item" >
          <view class="index">{{ item.index }}</view>
          <view class="time">{{ item.name }}</view>
        </view>
      </view>

      <view class="course-container">
        <view class="week" v-for="(week, weekIndex) in courseData" :key="weekIndex">
          <view class="courseList" v-for="(course, courseIndex) in week" :key="courseIndex">
            <view @click="handleCourseClick(course, weekIndex, courseIndex)" class="course" :style="{ height: (course.length * 80) + 'px', background: course.backgroundColor }" v-if="course.length > 0">{{ course.name }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'Timetable',
    props: {
      timetableType: {
        type: Array,
        default: () => {
          return [
            { index: '1', name: '08:00\n08:40' },
            { index: '2', name: '08:50\n09:30' },
            { index: '3', name: '09:40\n10:20' },
            { index: '4', name: '10:30\n11:10' },
            { index: '5', name: '11:20\n12:00' },
            { index: '6', name: '14:00\n14:40' },
            { index: '7', name: '15:50\n16:30' },
            { index: '8', name: '16:40\n17:20' },
            { index: '9', name: '17:30\n18:10' },
            { index: '10', name: '19:00\n19:40' },
            { index: '11', name: '20:50\n21:30' },
            { index: '12', name: '21:40\n22:20' }
          ]
        }
      },
      week: {
        type: Array,
        default: () => {
          return ['一', '二', '三', '四', '五', '六', '日']
        }
      },
      timetables: {
        type: Array,
        default: () => {
          return []
        }
      },
      palette: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        allPalette: [...this.palette, '#f05261', '#48a8e4', '#ffd061', '#52db9a', '#70d3e6', '#52db9a', '#3f51b5', '#f3d147', '#4adbc3', '#673ab7', '#f3db49', '#76bfcd', '#b495e1', '#ff9800', '#8bc34a']
      }
    },
    computed: {
      courseData () {
        // 为数据标记背景颜色的函数
        let paletteIndex = 0
        const getBackgroundColor = () => {
          const backgroundColor = this.allPalette[paletteIndex]
          paletteIndex++
          if (paletteIndex >= this.allPalette.length) {
            paletteIndex = 0
          }
          return backgroundColor
        }

        // 合并
        const listMerge = []
        this.timetables.forEach(function (list, i) {
          if (!listMerge[i]) {
            listMerge[i] = []
          }
          list.forEach(function (item, index) {
            if (!index) {
              return listMerge[i].push({ name: item, length: 1, backgroundColor: item === '' ? 'none' : getBackgroundColor() })
            }
            if (item === (listMerge[i][index - 1] || {}).name && item) {
              const sameIndex = (listMerge[i][index - 1] || {}).sameIndex
              if (sameIndex || sameIndex === 0) {
                listMerge[i][sameIndex].length++
                return listMerge[i].push({ name: item, length: 0, sameIndex: sameIndex })
              }
              listMerge[i][index - 1].length++
              return listMerge[i].push({ name: item, length: 0, sameIndex: index - 1 })
            } else {
              return listMerge[i].push({ name: item, length: 1, backgroundColor: item === '' ? 'none' : getBackgroundColor() })
            }
          })
        })
        return listMerge
      },
      todayWeekIndex () {
        let weekIndex = new Date().getDay() - 1
        if (weekIndex === -1) {
          weekIndex = 6
        }
        return weekIndex
      }
    },
    methods: {
      handleCourseClick (course, weekIndex, courseIndex) {
        const data = {
          index: courseIndex + 1,
          length: course.length,
          week: this.week[weekIndex],
          weekIndex: weekIndex,
          name: course.name
        }
        console.log(`星期${data.week}; 第${data.index}节课; 课程名:${data.name}; 课节:${data.length}`)
        console.log(data)
        this.$emit('courseClick', data)
      }
    }
  }
</script>

<style scoped lang="scss">
.timetable{
  background: white;
  border: 1px solid #E4E7ED;
  border-radius: 8rpx;

  .header{
    padding-left: 88rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    background: #F5F7FA;

    .header-item{
      flex: 1;
      text-align: center;
    }
  }

  .main{
    position: relative;
    .row{
      height: 80px;
      position: relative;
      &:after{
        content: '';
        height: 0;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-bottom: 1rpx dashed #E4E7ED;
      }

      .time-item{
        height: 100%;
        width: 88rpx;
        text-align: center;
        background: #F5F7FA;

        .index{
          color: #909399;
          padding-bottom: 8rpx;
          padding-top: 16rpx;
        }
      }
    }

    .course-container{
      position: absolute;
      top: 0;
      left: 88rpx;
      width: calc(100% - 88rpx);
      height: 100%;
      display: flex;

      .week{
        flex: 1;
        width: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        .courseList{
          word-break: break-all;
          color: white;
          overflow: hidden;

          .course{
            padding: 8rpx;
            border-radius: 16rpx;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
