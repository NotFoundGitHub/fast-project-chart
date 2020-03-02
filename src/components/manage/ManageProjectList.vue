<template>
    <div class="student-manage">
        <div class="student-manage-header">
            <div class="student-manage-header-info">
                <Card>
                    <img class="student-manage-header-info-img" :src="userInfo.smallFaceUrl" alt="头像">
                    <p slot="title">{{userInfo.realName}}</p>
                    <p>ID：{{userInfo.id}}</p>
                    <Divider class="student-manage-header-info-divider"/>
                    <p>手机：{{userInfo.phoneNumber}}</p>
                    <Divider class="student-manage-header-info-divider"/>
                    <p>总作品数：{{totalCount}}</p>
                    <Divider class="student-manage-header-info-divider"/>
                    <i-circle :percent="commentsPercent" dashboard style="width:80px;height:80px">
                        <span class="demo-circle-inner" style="font-size:24px">{{commentsPercent}}%</span>
                    </i-circle>
                    <p>点评进度</p>
                </Card>
            </div>
            <div class="student-manage-calendar">
                <p class="student-manage-calendar-title">用户创作日历</p>
                <Calendar :markDate="markDateArr" class="student-manage-calendar-pannel"></Calendar>
            </div>
        </div>
        <div class="user-manage-list-table">
            <Table
                ref="selections"
                :loading="loading"
                highlight-row
                :columns="columnList"
                :data="projectList"
                @on-selection-change="handleSelect"
                border >
            </Table>
        </div>
        <Modal
            v-model="restoreModal"
            title="你确定要恢复作品么"
            @on-ok="handleRestoreProject">
             <Input v-model="restoreUrl" placeholder="输入projectUrl,恢复指定作品" clearable style="width: 480px" />
        </Modal>
    </div>
</template>
<script>
    import Calendar from 'vue-calendar-component';
    import cache from '../../cache/cache';
    import TimeFormat from '../../common/TimeFormat';

    export default {
        name: 'manage-list',
        components: {
            Calendar
        },
        data() {
            return {
                commentsPercent: 0,
                selectStudent: '1',
                markDateArr: [],
                loading: true,
                userInfo: {},
                restoreModal: false,
                restoreProjectId: null,
                restoreUrl: null,
                columnList: [

                    {
                        title: '用户id',
                        key: 'authorId',
                        resizable: true,
                        'fixed': 'left',
                        width: 120
                    },
                    {
                        title: '作品id',
                        key: 'projectId',
                        resizable: true,
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.projectId),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        shape: 'circle',
                                        'icon': 'md-create'
                                    },
                                    style: {
                                        marginLeft: '20px'
                                    },
                                    on: {
                                        click: () => {
                                            this.jumpCreateLink(params.row.projectId, 0)
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small',
                                        shape: 'circle',
                                        'icon': 'md-share-alt'
                                    },
                                    style: {
                                        marginLeft: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.jumpCreateLink(params.row.projectId, 1)
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '作者名',
                        key: 'authorName',
                        resizable: true,
                        tooltip: true,
                        width: 140

                    },

                    {
                        title: '作品名',
                        key: 'projectName',
                        resizable: true,
                        tooltip: true

                    },
                    {
                        title: '作品url',
                        key: 'projectUrl',
                        resizable: true,
                        tooltip: true

                    },
                    {
                        title: '更新时间',
                        key: 'gmtModified',
                        resizable: true,
                        tooltip: true,
                        width: 180
                    },
                    {
                        title: '创作时间',
                        key: 'gmtCreate',
                        resizable: true,
                        tooltip: true,
                        width: 180
                    },

                    {
                        title: '改编作品id',
                        key: 'parentId',
                        tooltip: true,
                        width: 120,
                        resizable: true

                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 180,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.commentProject(params.row.projectId)
                                        }
                                    }
                                }, '点评'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.restoreProject(params.row.projectId)
                                        }
                                    }
                                }, '恢复作品')
                            ]);
                        }
                    }
                ],
                projectList: [],
                totalCount: 0
            }
        },
        // 生命周期
        mounted() {
            let memberId = this.$route.params.memberId
            this.initMemberInfo(memberId);
            this.initDate(memberId)
        },
        updated() {
        },
        methods: {
            async initDate(memberId) {
                let params = {
                    key: memberId,
                    type: 3,
                    pageIndex: 1,
                    pageSize: 300
                }
                let data = await cache.getFastProjectListByMemberInfo(params)
                this.totalCount = data.query.totleCount;
                // 点评列表
                let currentCommentList = JSON.parse(window.localStorage.getItem(memberId)) || [];
                this.calcCurrentCommentPercent(currentCommentList.length);
                data = data && data.list.map(project => {
                    this.markDateArr.push(TimeFormat.formatDay(project.gmtCreate))
                    project.gmtModified = TimeFormat.formatDate(project.gmtModified)
                    project.gmtCreate = TimeFormat.formatDate(project.gmtCreate)
                    // 添加点评情况
                    if (currentCommentList.includes(project.projectId)) {
                        project._checked = true;
                    }
                    return project;
                })
                this.projectList = data;
                this.loading = false;
                console.log('init', data)
            },
            async initMemberInfo(memberId) {
                let data = await cache.getUserInfo({memberId: memberId});
                this.userInfo = data;
            },
            // 选择某一行
            handleSelect(selection) {
                let memberId = this.$route.params.memberId;
                let currentCommentList = selection.map(i => {
                    return i.projectId;
                })
                window.localStorage.setItem(memberId, JSON.stringify(currentCommentList));
                // 计算进度
                this.calcCurrentCommentPercent(selection.length);
            },
            calcCurrentCommentPercent(selectCount) {
                this.commentsPercent = Math.ceil((selectCount / this.totalCount) * 100);
            },
            // 清空所有数据
            handleClearAll () {
                let memberId = this.$route.params.memberId;
                window.localStorage.removeItem(memberId);
                this.$refs.selection.selectAll(false);
            },
            // 跳转创作页面
            jumpCreateLink: (id, type) => {
                switch (type) {
                    case 0:
                        window.open(`https://geek.163.com/path/project/fast/create#${id}`, '_blank')
                        break;
                    case 1:
                        window.open(`https://m.geek.163.com/mpath/project/share/${id}`, '_blank')
                }
            },
            // 点评作品
            commentProject(projectId) {
                this.$router.push({name: 'project.detail', params: { projectId }})
            },
            // 点击确认
            async handleRestoreProject() {
                if (this.restoreProjectId) {
                    if (this.restoreUrl && this.restoreUrl.trim()) {
                        await cache.restoreProject({projectId: this.restoreProjectId, projectUrl: this.restoreUrl.trim()});
                        console.log('恢复某次', this.restoreUrl)
                    } else {
                        await cache.restoreProject({projectId: this.restoreProjectId});
                        console.log('恢复初始作品')
                    }
                }
            },
            // 恢复作品
            restoreProject(projectId) {
                console.log('projectId', projectId)
                this.restoreProjectId = projectId;
                this.restoreModal = true;
            }
        }
    }
</script>
<style lang="less" >
.student-manage{
    &-header{
        display: flex;
        justify-content: space-between;
        margin: 10px;
        &-info{
            &-img{
                width: 60px;
            }
            &-divider{
                margin: 10px 0;
            }
        }
    }
    &-calendar{

        .wh_container{
            margin:  0 !important;
        }
        &-title{
            margin: 10px auto;
        }
        &-pannel{
            .wh_content_all{
                box-shadow: 1px 1px 5px #999;
                background: #fff !important;
                .wh_top_changge{
                    li{
                        color: #17233d  !important;
                    }
                    .wh_jiantou2[data-v-2ebcbc83] {
                        width: 12px;
                        height: 12px;
                        border-top: 2px solid #000;
                        border-right: 2px solid #000;
                        transform: rotate(45deg);
                    }
                    .wh_jiantou1{
                        width: 12px;
                        height: 12px;
                        border-top: 2px solid #000;
                        border-left: 2px solid #000;
                        transform: rotate(-45deg);
                    }
                }
                .wh_isMark{
                    background: #2d8cf0 !important;
                }
                .wh_item_date.wh_isToday{
                    background: #ed4014 !important;
                }
                .wh_content_item{
                    color: #17233d  !important;
                }
            }
    }
    }
}

</style>
