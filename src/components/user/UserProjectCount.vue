<template>
  <div class="hello">
	<Button type="primary" @click="getFastProjectInfo">show</Button>
	<DatePicker v-model="startTime" type="date" show-week-numbers placeholder="起始时间" style="width: 200px"></DatePicker>
	<DatePicker v-model="endTime" type="date" show-week-numbers placeholder="结束时间" style="width: 200px"></DatePicker>
	<Button type="primary" @click="getProjectUserRate">获取排名</Button>

    <Card :bordered="false">
      <p slot="title">起始时间：{{startTime | timeFormat}}</p>
      <p>{{msg}}</p>
      <ve-histogram :data="chartData" ></ve-histogram>
    </Card>
	<img :src="backUrl" alt="back" v-if="!!backUrl">

  </div>
</template>

<script>
import cache from '../../cache/cache';
import TimeFormat from '@/common/TimeFormat';

export default {
    name: 'project-count',
    data () {
        return {
			msg: 'Welcome to Your Vue.js App',
			backUrl: '',
			startTime: null,
			endTime: null,
			chartSettings: {
				showLine: ['数量']
			},
			chartData: {
				columns: ['用户ID', '数量'],
				rows: [
					{ '用户ID': '1/1', '数量': 1093 },
					{ '用户ID': '1/2', '数量': 3230 },
					{ '用户ID': '1/3', '数量': 2623 },
					{ '用户ID': '1/4', '数量': 1423 },
					{ '用户ID': '1/5', '数量': 3492 },
					{ '用户ID': '1/6', '数量': 4293 }
				]
			}
		};
    },
    filters: {
      timeFormat (time) {
        return time && TimeFormat.format(time);
      }
    },
    methods: {
        async getFastProjectInfo () {
			let data = await cache.getProjectInfo({projectId: 6})
			this.msg = data;
			this.backUrl = data.smallFaceUrl;
			console.log(data)
        },
        async getProjectUserRate () {
			let startTime = this.startTime && new Date(this.startTime).valueOf()
			let endTime = this.endTime && new Date(this.endTime).valueOf()
			console.log('startTime', startTime);
			let data = await cache.getProjectUserRate({startTime, endTime})

			this.chartData.rows = this.convertTable(data);
			console.log(data)
		},
		convertTable (data) {
			return data && data.map(i => {
				i['用户ID'] = i.memberId;
				i['数量'] = i.count;
				return i;
			})
		}

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
