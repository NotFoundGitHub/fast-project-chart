<template>
  <div class="project-count-sum">
	<p class="project-count-sum-title">{{title}}，共计{{sumProject}}个</p>
	<DatePicker v-model="startTime" type="date" show-week-numbers placeholder="起始时间" style="width: 200px"></DatePicker>
	<Button type="primary" @click="getProjectDays">查询</Button>
    <Card :bordered="false" class="project-count-sum-card">
		<ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
    </Card>

  </div>
</template>

<script>
    import cache from '../../cache/cache';
    import TimeFormat from '../../common/TimeFormat';

    export default {
        name: 'project-count-sum',
        data () {
            return {
                title: '7日内作品数量排行',
                startTime: null,
                endTime: null,
                chartSettings: {
                    metrics: ['数量']
                },
                sumProject: 0,
                chartData: {
                    columns: ['日期', '数量'],
                    rows: [
                        { '日期': 'aaa', '数量': 1093 },
                        { '日期': 'bbb', '数量': 100 }
                    ]
                }
            };
        },
        filters: {
            timeFormat (time) {
                return time && TimeFormat.formatDate(time);
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            async initData() {
                this.sumProject = 0;
                let data = await cache.getEveryDayProjectCount({});
                this.convertDataToChart(data, null);
            },
            convertDataToChart(data, days) {
                let dateArr = TimeFormat.getLastDays(days || 7).reverse();
                data = this.convertCountDateArrToObject(data);
                this.chartData.rows = dateArr.map(date => {
                    let obj = data[date]
                    obj['日期'] = (obj && obj.time) || date;
                    obj['数量'] = (obj && obj.count) || 0;
                    this.sumProject = this.sumProject + obj['数量'];
                    return obj;
                });
            },
            // 将数组转换为对象
            convertCountDateArrToObject(arr) {
                let obj = {};
                arr && arr.map(item => {
                    obj[item.time] = item;
                })
                return obj;
            },
            async getProjectDays() {
                let startTime = this.startTime;
                if (!startTime) {
                    this.initData();
                } else {
                    let duration = TimeFormat.diffDay(new Date(), startTime);
                    if (duration <= 0) {
                        this.$Message['error']({
                            background: true,
                            content: '未来可期~'
                        });
                        return false;
                    }
                    this.sumProject = 0;
                    let data = await cache.getEveryDayProjectCount({days: duration});
                    this.convertDataToChart(data, duration);
                    this.title = `最近 ${duration + 1} 日内作品数量排行`
                }
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
.project-count-sum{
	&-title{
		margin-bottom: 20px;
		font-size: 16px;
		color: #666;
	}
	&-card{
		margin: 60px auto;
	}
}
</style>
