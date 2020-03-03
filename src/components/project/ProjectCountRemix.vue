<template>
  <div class="project-count-rate">
	<p class="project-count-rate-title">{{title}}</p>
	<DatePicker v-model="startTime" type="date" show-week-numbers placeholder="起始时间" style="width: 200px"></DatePicker>
	<DatePicker v-model="endTime" type="date" show-week-numbers placeholder="结束时间" style="width: 200px"></DatePicker>
	<Button type="primary" @click="getProjectUserRate">获取排名</Button>
    <Card :bordered="false" class="project-count-rate-card">
		<p slot="title" v-if="!!startTime">起始时间：{{startTime | timeFormat}}</p>
		<ve-bar :data="chartData" :settings="chartSettings"></ve-bar>
    </Card>

  </div>
</template>

<script>
    import cache from '../../cache/cache';
    import TimeFormat from '@/common/TimeFormat';

    export default {
        name: 'project-count-rate',
        data () {
            return {
                title: '用户作品数量排行',
                startTime: null,
                endTime: null,
                chartSettings: {
                    metrics: ['数量'],
                    dataOrder: {
                        label: '数量',
                        order: 'desc'
                    }
                },
                chartData: {
                    columns: ['用户名', '数量'],
                    rows: [
                        { '用户名': 'aaa', '数量': 1093 },
                        { '用户名': 'bbb', '数量': 100 }
                    ]
                }
            };
        },
        filters: {
            timeFormat (time) {
                return time && TimeFormat.formatDate(time);
            }
        },
        methods: {

            async getProjectUserRate () {
                let startTime = this.startTime && new Date(this.startTime).valueOf()
                let endTime = this.endTime && new Date(this.endTime).valueOf()
                let data = await cache.getProjectUserRate({startTime, endTime})
                this.chartData.rows = this.convertTable(data);
            },
            // 转换成图表
            convertTable (data) {
                return data && data.map(i => {
                    i['用户名'] = this.subStrName(i.realName);
                    i['数量'] = i.count;
                    return i;
                })
            },
            subStrName(name) {
                const MAX_NAME_LENGTH = 6;
                if (name && /[^u4e00-u9fa5]/img.test(name)) {
                    name = name.substr(0, Math.floor(MAX_NAME_LENGTH / 2));
                }
                if (name && name.length <= MAX_NAME_LENGTH) {
                    return name;
                }
                return name && name.substr(0, MAX_NAME_LENGTH) + '...';
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
.project-count-rate{
	&-title{
		margin-bottom: 20px;
		font-size: 16px;
		color: #666;
	}
	&-card{
		width: 540px;
		margin: 60px auto;
	}
}
</style>
