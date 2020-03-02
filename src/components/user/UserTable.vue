<template>
    <div class="user-project-table">
        <div class="user-project-table-search">
            <Select v-model="selectType" style="width:120px">
                <Option v-for="item in SelectOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input
                v-model="searchKey"
                clearable
                placeholder="输入作品id或者用户id"
                @on-enter="searchUserProjectList(null,null)"
                class="user-project-table-search-input"
                style="width: 300px"/>
             <Button @click="searchUserProjectList(null,null)" class="user-project-table-search-btn" type="primary" shape="circle" icon="ios-search">搜索</Button>
        </div>
        <div class="user-project-table-info">
            <span style="margin-left:20px;color:#333"> 图示：</span>
            <Button class="btn" shape="circle" icon="md-add"></Button>添加学生到 "我的学生" 里面
            <Button class="btn" type="primary" shape="circle" icon="md-create"></Button> 打开作品创作页
            <Button class="btn" type="success" shape="circle" icon="md-share-alt"></Button>打开作品分享页
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
                :total="totalCount"
                :current="currentPage"
                show-sizer
                show-total
                @on-change="handleChangePage"
                @on-page-size-change="handlePageSizeChange"
                :page-size="pageSize"
            />
        </div>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';
    import cache from '../../cache/cache';
    import TimeFormat from '../../common/TimeFormat';

    export default {
        computed: {
            ...mapState(['manage'])
        },
        data() {
            return {
                SelectOption: [
                    {
                        label: '作品id',
                        value: '1'
                    },
                    {
                        label: '改编作品id',
                        value: '2'
                    },
                    {
                        label: '用户id',
                        value: '3'
                    },
                    {
                        label: '手机号',
                        value: '4'
                    }
                ],
                selectType: '1',
                searchKey: '',
                loading: true,
                columnList: [
                    {
                        title: '用户id',
                        key: 'authorId',
                        resizable: true,
                        'fixed': 'left',
                        width: 160,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {}, params.row.authorId),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        shape: 'circle',
                                        'icon': 'md-add',
                                        disabled: params.row.hasAdd
                                    },
                                    style: {
                                        marginLeft: '20px'
                                    },
                                    on: {
                                        click: () => {
                                            this.addMangerMember(params.row)
                                        }
                                    }
                                })
                            ]);
                        }
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
                                }, '点评')
                            ]);
                        }
                    }
                ],
                projectList: [],
                totalCount: 100,
                currentPage: 1,
                pageSize: 20
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
            ...mapMutations(['addManageStudentCount']),
            async initDate() {
                let data = await cache.getAllFastProject({});
                this.totalCount = data.query.totleCount;
                this.projectList = this.formatListTime(data.list) || [];
                this.loading = false;
                console.log('init', data)
            },
            formatListTime(data) {
                return data && data.map(project => {
                    project.gmtModified = TimeFormat.formatDate(project.gmtModified)
                    project.gmtCreate = TimeFormat.formatDate(project.gmtCreate)
                    // 是否可以添加
                    let manageStudentList = JSON.parse(window.localStorage.getItem('manageStudentList')) || [];
                    let memberList = manageStudentList.map(i => i.authorId) || [];
                    if (memberList.includes(project.authorId)) {
                        project.hasAdd = true
                    }
                    return project;
                })
            },
            // 搜索
            async searchUserProjectList(pageIndex, pageSize) {
                let key = this.searchKey;
                let type = this.selectType;
                if (!key) {
                    await this.initDate();
                    return true;
                }
                let data = [];
                if (pageIndex && pageSize) {
                    data = await cache.getFastProjectListByMemberInfo({key, type})
                } else {
                    data = await cache.getFastProjectListByMemberInfo({key, type, pageIndex, pageSize})
                }
                console.log('search data:', data)
                console.log('type', type)

                // 进行解析
                switch (type) {
                    case '1':
                        break;
                    case '2':
                        console.log('data.query.totalCount', data)
                        this.totalCount = data.query.totleCount;
                        data = data.list;
                        break;
                    default:
                        console.log('data.query.totalCount', data)
                        this.totalCount = data.query.totleCount;
                        data = data.list;
                }
                this.projectList = this.formatListTime(data) || [];
                console.log('search data:', data)
            },
            handleChangePage(page) {
                console.log('page', page)
                this.currentPage = page;
                this.searchUserProjectList(this.page, this.pageSize)
            },
            handlePageSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.searchUserProjectList(this.page, this.pageSize)
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
            },
            // 向本地存入用户信息
            addMangerMember(row) {
                // 1.先从localStorage中取出数据
                let manageStudentList = window.localStorage.getItem('manageStudentList');
                if (manageStudentList) {
                    manageStudentList = JSON.parse(manageStudentList);
                } else {
                    manageStudentList = []
                }
                // 判断是否已经存在该用户id
                let hasAddStudent = false;
                manageStudentList.some(item => {
                    if (item.authorId === row.authorId) {
                        hasAddStudent = true;
                        return true;
                    }
                })
                if (hasAddStudent) {
                    this.$Message['error']({
                        background: true,
                        content: '小老弟你怎么肥事，已经添加过了'
                    });
                    return;
                }
                // 2.筛选需要的数据
                let date = {
                    authorId: row.authorId,
                    authorName: row.authorName,
                    smallFaceUrl: row.smallFaceUrl
                }

                // 3.向列表中增加一条数据
                manageStudentList.push(date);
                // 4.存入本地
                window.localStorage.setItem('manageStudentList', JSON.stringify(manageStudentList));
                // 修改学生数量
                this.addManageStudentCount({
                    studentCount: this.manage.studentCount + 1
                })
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
    &-info{
        text-align: left;
        margin-top:10px;
        .btn {
            margin: 10px;
        }
    }
    &-table{
        margin-top:30px;
    }
    &-page{
        margin-top:40px;

    }
}
</style>
