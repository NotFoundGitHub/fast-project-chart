<template>
    <div class="user-project-table">
        <div class="user-project-table-search">
            <Select v-model="selectValue" style="width:120px">
                <Option v-for="item in SelectOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input
                v-model="searchId"
                clearable
                placeholder="输入作品id或者用户id"
                @on-enter="selectProject"
                class="user-project-table-search-input"
                style="width: 300px"/>
             <Button class="user-project-table-search-btn" type="primary" shape="circle" icon="ios-search">搜索</Button>
        </div>
        <div class="user-project-table-table">
            <Table
                :loading="loading"
                highlight-row
                ref="currentRowTable"
                :columns="columnList"
                :data="projectList"
                border >
            </Table>

        </div>
        <div class="user-project-table-page">
            <Page
                :total="100"
                show-sizer
                @on-change="handleChangePage"
                @on-page-size-change="handlePageSizeChange"
                :page-size="20"
            />
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                SelectOption: [
                    {
                        label: '作品id',
                        value: 'projectId'
                    },
                    {
                        label: '改编作品id',
                        value: 'parentId'
                    },
                    {
                        label: '用户id',
                        value: 'memberId'
                    },
                    {
                        label: '手机号',
                        value: 'phoneNumber'
                    }
                ],
                selectValue: 'projectId',
                searchId: '',
                loading: false,
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
                                            this.remove(params.index)
                                        }
                                    }
                                }, 'Delete')
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
                    }
                ]
            }
        },
        // 生命周期
        mounted() {
            this.initDate();
        },
        updated() {
            console.log('updated....')
        },
        methods: {
            initDate() {
                console.log('init', this)
                for (let i = 0; i < 10; i++) {
                    this.projectList.push(this.projectList[0])
                }
            },
            selectProject: function() {
                console.log('select', this.searchId)
            },
            handleChangePage: (page) => {
                console.log('page', page)
            },
            handlePageSizeChange: (pageSize) => {
                console.log('pageSize', pageSize)
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
            }
        }
    }
</script>
<style lang="less" scoped>
.user-project-table{
    margin:40px auto 0 auto;
    &-search{
        display: flex;
        &-input{
            margin-left: 10px;
        }
        &-btn{
            margin-left: 10px;
        }
    }
    &-table{
        margin-top:40px;
    }
    &-page{
        margin-top:40px;

    }
}
</style>
