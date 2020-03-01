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
                    <i-circle :percent="commentsPercent" dashboard>
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
                :loading="loading"
                highlight-row
                ref="currentRowTable"
                :columns="columnList"
                :data="projectList"
                border >
            </Table>
        </div>
        <Modal
            v-model="restoreModal"
            title="你确定要恢复作品么"
            @on-ok="handleRestoreProject">
             <Input v-model="restoreUrl" placeholder="输入projectUrl" clearable style="width: 480px" />
        </Modal>
    </div>
</template>
<script>
    import Calendar from 'vue-calendar-component';
    export default {
        name: 'manage-list',
        components: {
            Calendar
        },
        data() {
            return {
                commentsPercent: 90,
                selectStudent: '1',
                markDateArr: ['2020-02-20', '2020-02-22', '2020/2/25', '2020-02-28'],
                loading: false,
                userInfo: {
                    id: 1024322691,
                    realName: '王小明',
                    phoneNumber: 13245687894,
                    smallFaceUrl: '//edu-image.nosdn.127.net/33b4ed3e-99e0-451b-8f73-cb34d7e80568.png'

                },
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
                        key: 'gmtModify',
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
                projectList: [
                    {
                        projectId: 1,
                        projectName: 'zzz的编程作品1',
                        authorId: 1024322691,
                        authorName: 'zzz',
                        thumbUpCount: 0,
                        viewCount: 7,
                        thumbnailUrl: '//steam.nosdn.127.net/e5d75a56273562541593c8dfbde07206.png',
                        projectUrl: '//steam.nosdn.127.net/e21f7b07d335fac1b5033fff6d47dcbb.json',
                        thumbUped: false,
                        gmtCreate: '2020-02-22 22:22:22',
                        gmtModify: '2020-02-22 22:22:22',
                        smallFaceUrl: '//edu-image.nosdn.127.net/a3bd7746-2b1a-4be3-9b37-dab599dd3f8c.png',
                        parentId: null
                    },
                    {
                        projectId: 12345,
                        projectName: '01-休闲滑板车',
                        authorId: 1390992911,
                        authorName: '齐宏霖',
                        thumbUpCount: 0,
                        viewCount: 2,
                        thumbnailUrl: '//steam.nosdn.127.net/7526211fc652f05ff75f242d43f0ce20.png',
                        projectUrl: '//steam.nosdn.127.net/6c1120f4243d99c2f1a41d09056d0ef6.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/d686b6f6-95c4-479d-8c99-263791b186d1.png',
                        parentId: 1468
                    },
                    {
                        projectId: 33190,
                        projectName: '02-舞蹈时刻',
                        authorId: 1416405559,
                        authorName: '兜兜',
                        thumbUpCount: 0,
                        viewCount: 2,
                        thumbnailUrl: '//steam.nosdn.127.net/7abc603b6bdce71e1d184a2420da1a00.png',
                        projectUrl: '//steam.nosdn.127.net/3cf7094599d2d27a4b5db92e2e5acc4c.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/6900d9c9-450c-4fd0-b44e-336fd8fa0c79.png',
                        parentId: 3402
                    }, {
                        projectId: 33184,
                        projectName: '04-古堡营救',
                        authorId: 1422855138,
                        authorName: '诚诚',
                        thumbUpCount: 0,
                        viewCount: 2,
                        thumbnailUrl: '//steam.nosdn.127.net/642d76114c2b12a78bf0edc1ecc51a29.png',
                        projectUrl: '//steam.nosdn.127.net/8cc537c2129fd0cc9c0d2e92b72cd153.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/33b4ed3e-99e0-451b-8f73-cb34d7e80568.png',
                        parentId: 2592
                    }, {
                        projectId: 33187,
                        projectName: '02-欢乐动物园',
                        authorId: 1421193276,
                        authorName: '王笑儒',
                        thumbUpCount: 0,
                        viewCount: 3,
                        thumbnailUrl: '//steam.nosdn.127.net/9e99066f1b47bec65af2be74b3f9a53c.png',
                        projectUrl: '//steam.nosdn.127.net/d0958981c24e0a077df92b20f0404b41.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/43e4f85c-e148-4973-b701-67a5cbb7d8c4.png',
                        parentId: 382
                    }, {
                        projectId: 29982,
                        projectName: '03-换装大挑战',
                        authorId: 1425118674,
                        authorName: '开心',
                        thumbUpCount: 0,
                        viewCount: 5,
                        thumbnailUrl: '//steam.nosdn.127.net/407dedf3df4192e2feadf6e566245527.png',
                        projectUrl: '//steam.nosdn.127.net/67e2ba219c6699740ff4772e2937c5ed.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/a3bd7746-2b1a-4be3-9b37-dab599dd3f8c.png',
                        parentId: 14667
                    },
                    {
                        projectId: 28760,
                        projectName: '02-欢乐动物园',
                        authorId: 1425118674,
                        authorName: '开心',
                        thumbUpCount: 0,
                        viewCount: 8,
                        thumbnailUrl: '//steam.nosdn.127.net/8a8b9c7e78c76d15a5e98649a5012604.png',
                        projectUrl: '//steam.nosdn.127.net/e886cec015f7126b2ce607e16d4216e0.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/a3bd7746-2b1a-4be3-9b37-dab599dd3f8c.png',
                        parentId: 382
                    }, {
                        projectId: 28007,
                        projectName: '01-休闲滑板车',
                        authorId: 1425118674,
                        authorName: '开心',
                        thumbUpCount: 0,
                        viewCount: 3,
                        thumbnailUrl: '//steam.nosdn.127.net/15d77afec15489027b928c8ca32b13d9.png',
                        projectUrl: '//steam.nosdn.127.net/a423bfdf3593b05975b73c367ba2440b.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/a3bd7746-2b1a-4be3-9b37-dab599dd3f8c.png',
                        parentId: null
                    },
                    {
                        projectId: 9484,
                        projectName: '01-休闲滑板车',
                        authorId: 1416405559,
                        authorName: '兜兜',
                        thumbUpCount: 0,
                        viewCount: 4,
                        thumbnailUrl: '//steam.nosdn.127.net/9bdf4155f38e6cf17e682a273a50b215.png',
                        projectUrl: '//steam.nosdn.127.net/2786d44bb2d16135ad0888d765ea7ca2.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/6900d9c9-450c-4fd0-b44e-336fd8fa0c79.png',
                        parentId: 1468
                    }, {
                        projectId: 32098,
                        projectName: '03-电子贺卡',
                        authorId: 1422855138,
                        authorName: '诚诚',
                        thumbUpCount: 1,
                        viewCount: 5,
                        thumbnailUrl: '//steam.nosdn.127.net/90adb1b66f0bebce957aaf1e05663082.png',
                        projectUrl: '//steam.nosdn.127.net/b404a9cb9f35b43e259ff1e267bfbace.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/33b4ed3e-99e0-451b-8f73-cb34d7e80568.png',
                        parentId: 3494
                    }, {
                        projectId: 26657,
                        projectName: '02-欢乐动物园',
                        authorId: 1422855138,
                        authorName: '诚诚',
                        thumbUpCount: 1,
                        viewCount: 7,
                        thumbnailUrl: '//steam.nosdn.127.net/51d878205516e441afb0ffab0656295b.png',
                        projectUrl: '//steam.nosdn.127.net/2f4553f01958e718b12964ee28b1c899.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/33b4ed3e-99e0-451b-8f73-cb34d7e80568.png',
                        parentId: 382
                    },
                    {
                        projectId: 27628,
                        projectName: '02-欢乐动物园',
                        authorId: 1424656055,
                        authorName: '虎哥',
                        thumbUpCount: 0,
                        viewCount: 4,
                        thumbnailUrl: '//steam.nosdn.127.net/0018dcea9b3a9e6e7a4502fd466aa318.png',
                        projectUrl: '//steam.nosdn.127.net/8af10666ab3bd69ad5e66fc66199c413.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/6900d9c9-450c-4fd0-b44e-336fd8fa0c79.png',
                        parentId: 382
                    }, {
                        projectId: 32812,
                        projectName: '02-欢乐动物园',
                        authorId: 1421434922,
                        authorName: '李思妍',
                        thumbUpCount: 0,
                        viewCount: 5,
                        thumbnailUrl: '//steam.nosdn.127.net/0583de9bd775a79db2c418a869e99a9a.png',
                        projectUrl: '//steam.nosdn.127.net/4b8b203f6dce049ec251c2e5290e51a2.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/33b4ed3e-99e0-451b-8f73-cb34d7e80568.png',
                        parentId: 382
                    }, {
                        projectId: 30874,
                        projectName: '01-休闲滑板车',
                        authorId: 1421434922,
                        authorName: '李思妍',
                        thumbUpCount: 0,
                        viewCount: 2,
                        thumbnailUrl: '//steam.nosdn.127.net/5ef03e6d8d42342d87548b203b17c17a.png',
                        projectUrl: '//steam.nosdn.127.net/2b06cb786d33c836ad0e9100f2811cbf.json',
                        thumbUped: false,
                        smallFaceUrl: '//edu-image.nosdn.127.net/33b4ed3e-99e0-451b-8f73-cb34d7e80568.png',
                        parentId: 1468
                    }
                ]
            }
        },
        // 生命周期
        mounted() {
        },
        updated() {
            console.log('updated....')
        },
        methods: {

            selectProject: function() {
                console.log('select', this.searchId)
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
            handleRestoreProject() {
                if (this.restoreProjectId) {
                    if (this.restoreUrl && this.restoreUrl.trim()) {
                        console.log('恢复某次', this.restoreUrl)
                    } else {
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
