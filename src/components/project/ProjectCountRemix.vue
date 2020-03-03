<template>
  <div class="project-count-Remix">
	<p class="project-count-Remix-title">{{title}}</p>
	<DatePicker v-model="startTime" type="date" show-week-numbers placeholder="起始时间" style="width: 200px"></DatePicker>
	<DatePicker v-model="endTime" type="date" show-week-numbers placeholder="结束时间" style="width: 200px"></DatePicker>
	<Input
        v-model="remixTag"
        clearable
        placeholder="输入改编作品id"
        @on-enter="addRemixProjectIdTag()"
        class="project-count-Remix-input"
        style="width: 300px"/>
    <Button type="primary" @click="addRemixProjectIdTag">增加标签</Button>
    <Card :bordered="false" class="project-count-Remix-card">
		<p slot="title" v-if="!!startTime">起始时间：{{startTime | timeFormat}}</p>
		<ve-bar :data="chartData" :settings="chartSettings"></ve-bar>
    </Card>

  </div>
</template>

<script>
    import cache from '../../cache/cache';
    import TimeFormat from '../../common/TimeFormat';

    export default {
        name: 'project-count-Remix',
        data () {
            return {
                title: '用户作品数量排行',
                startTime: null,
                endTime: null,
                remixTag: null,
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
        mounted() {
            this.initData();
        },
        methods: {
            async initData() {

            },
            addRemixProjectIdTag() {

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
.project-count-Remix{
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
