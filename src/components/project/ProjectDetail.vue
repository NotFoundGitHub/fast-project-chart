<template>
    <div class="project-detail">
        <iframe class="project-detail-iframe" frameborder = "0" src="https://geek.163.com/path/project/fast/create#1"></iframe>
        <div class="project-detail-comment">
            <p class="project-detail-comment-title">点评模板</p>
            <div class="project-detail-comment-list">
                <Card
                    v-for="(item,index) in commentAllList"
                    :key="'detail'+index"
                    :bordered="false"
                    class="project-detail-comment-list-card">
                    <p slot="title">示例 {{index+1}}</p>
                    <p>{{item}}</p>
                </Card>
                <p class="project-detail-comment-list-divide">点评事项</p>
                <Card  v-for="(item,index) in commentPartList"
                    :key=index
                    :bordered="false"
                    class="project-detail-comment-list-card">
                    <p slot="title">{{item.key}}</p>
                        <List border size="small">
                            <ListItem class="project-detail-comment-list-card-li" v-for="(part,i) in item.value" :key="'detail'+index+'part'+i">{{part.trim()}}</ListItem>
                        </List>
                </Card>

            </div>
        </div>
    </div>
</template>
<script>
    import Comment from '../../common/Comment';
    import cache from '../../cache/cache';

    export default {
        name: 'project-detail',
        data() {
            return {
                commentAllList: [],
                commentPartList: []

            }
        },
        mounted() {
            this.initCommnetList();
        },
        methods: {
            async initCommnetList() {
                let projectId = this.$route.params.projectId;
                let projectInfo = await cache.getProjectInfo({projectId});
                let projectName = '01-休闲滑板车';
                let authorName = projectInfo.authorName;

                // let projectName = projectInfo.projectName;
                Object.keys(Comment).some(item => {
                    if (projectName.includes(item)) {
                        this.commentAllList = Comment[item].all;
                        this.commentPartList = Comment[item].part;
                        return true;
                    }
                })
                this.commentAllList = this.commentAllList.map(item => {
                    return item.replace('XXX', authorName + ' ')
                })
                this.commentPartList = Object.keys(this.commentPartList).map(item => {
                    let obj = {};
                    obj.key = item;
                    obj.value = this.commentPartList[item].replace(/例/img, '$例').split('$').slice(1);
                    return obj;
                })
            }
        }
    }
</script>
<style lang="less" scoped>
.project-detail{
        display: flex;
    &-iframe{
        height: calc(100vh - 60px);
        width: calc(100vh * 1.25);
    }
    &-comment{
        height: calc(100vh - 60px);
        width: calc(100vw - (100vh * 1.25));
        overflow-y: auto;
        background: #eee;
        &-title{
            font-size: 18px;
            padding: 10px 0;
            background: #666;
            color: #fff;
        }
        &-list{
            margin-top: 5px;
            &-card{
                margin: 15px 0;
                &-li{
                    text-align: left;
                }
            }
            &-divide{
                font-size: 18px;
                padding: 10px 0;
                background: #666;
                color: #fff;
            }
        }
    }
}
</style>
