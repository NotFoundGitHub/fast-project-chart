<template>
  <div class="project-count-Remix">
	<p class="project-count-Remix-title">{{title}}</p>
	<DatePicker v-model="startTime" type="date" show-week-numbers placeholder="起始时间" style="width: 200px"></DatePicker>
	<DatePicker v-model="endTime" type="date" show-week-numbers placeholder="结束时间" style="width: 200px"></DatePicker>
    <Button type="primary" @click="getProjectDays">查询</Button>
    <Divider/>

    <Card :bordered="false" class="project-count-Remix-tagList">

        <div slot="title">
            <Input
            v-model="remixTag"
            clearable
            placeholder="输入改编作品id"
            @on-enter="addRemixProjectIdTag()"
            class="project-count-Remix-input"
            style="width: 300px"/>
            <Button type="primary" @click="addRemixProjectIdTag">增加标签</Button>
        </div>
        <Tag
            v-for="(item,index) in tagList"
            :key="'remix-tag-'+index"
            @on-close="handleDeleteTag(index)"
            closable
            checkable
            :checked="item.isShowTag"
            :name="item.content"
            @on-change="changeTagState"
            color="primary"
            class="project-count-Remix-tagList-tag">{{item.content}}</Tag>
    </Card>

    <Card :bordered="false" class="project-count-Remix-card">
		<p slot="title" v-if="!!startTime">起始时间：{{startTime | timeFormat}}</p>
		<ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
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
                title: '改编作品统计',
                startTime: null,
                endTime: null,
                // 输入框
                remixTag: null,
                chartSettings: {
                    metrics: ['数量'],
                    dataOrder: {
                        label: '数量',
                        order: 'desc'
                    }
                },
                tagList: [1468, 382, 3396],
                chartData: {
                    columns: ['日期', '数量'],
                    rows: []
                },
                sumProject: 0,
                currentTag: null
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
                this.tagList = JSON.parse(window.localStorage.getItem('remixTagList')) || [];
                // 抹除勾选的标签
                this.closeOtherTags(null);
            },
            addRemixProjectIdTag() {
                // 获取input内容
                let tag = this.remixTag;
                if (!tag || !tag.trim() || !-tag) {
                    this.$Message['error']({
                        background: true,
                        content: '你中毒了~'
                    });
                    return false;
                }
                this.tagList.push({content: tag, isShowTag: false});
                // 存入本地
                window.localStorage.setItem('remixTagList', JSON.stringify(this.tagList));
                // 情况input内容
                this.remixTag = '';
            },
            // 删除标签
            handleDeleteTag(index) {
                this.tagList.splice(index, 1);
                // 存入本地
                window.localStorage.setItem('remixTagList', JSON.stringify(this.tagList));
            },
            // 切换状态
            async changeTagState(checkd, remixId) {
                if (checkd) {
                    // 其余标签状态关闭
                    this.closeOtherTags(remixId);
                    let days = 7;
                    let data = await cache.getEveryDayProjectCount({days: 7, parentId: remixId});
                    this.convertDataToChart(data, null);
                    this.title = `最近 ${days} 日内 ${remixId} 的改编数量 ${this.sumProject}`
                    // 记录当前tag
                    this.currentTag = remixId;
                }
                this.sumProject = 0;
            },
            // 关闭标签 0 当前以外，1 全部
            closeOtherTags(remixId) {
                this.tagList = this.tagList && this.tagList.map(item => {
                    if (!remixId) {
                        item.isShowTag = false;
                    } else {
                        if (item.content !== remixId) {
                            item.isShowTag = false;
                        } else {
                            item.isShowTag = true;
                        }
                    }
                    return item;
                })
            },
            convertDataToChart(data, days) {
                let dateArr = TimeFormat.getLastDays(days || 7).reverse();
                data = this.convertCountDateArrToObject(data);
                this.chartData.rows = dateArr.map(date => {
                    let obj = data[date] || {};
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
                let parentId = this.currentTag;
                if (!parentId) {
                    this.$Message['error']({
                        background: true,
                        content: '我查哪个改编作品啊？？？~'
                    });
                    return false;
                }

                if (!startTime) {
                    // 默认七天情况
                    await this.changeTagState(true, parentId);
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
                    // 获取当前选中的tag

                    let data = await cache.getEveryDayProjectCount({days: duration, parentId});
                    this.convertDataToChart(data, duration);
                    this.title = `最近 ${duration + 1} 日内 ${parentId} 的改编数量 ${this.sumProject}`
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
.project-count-Remix{
	&-title{
		margin-bottom: 20px;
		font-size: 16px;
		color: #666;
    }
    &-tagList{
        &-tag{
            cursor: pointer;
            border: 1px dashed #2d8cf0!important;
            font-size: 14px!important;
            height: 30px!important;
            line-height: 30px!important;

        }
    }
	&-card{
		margin: 60px auto;
	}
}
</style>
