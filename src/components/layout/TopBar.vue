<template>
    <div>
        <Menu mode="horizontal" theme="primary" active-name="1">
            <MenuItem name="1" to="/project">
                <Icon type="ios-paper" />
                作品排行
            </MenuItem>
            <MenuItem name="2" to="/user">
                <Icon type="ios-people" />
                用户管理
            </MenuItem>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="ios-stats" />
                    统计分析
                </template>
                <MenuGroup title="使用">
                    <MenuItem name="3-1">新增和启动</MenuItem>
                    <MenuItem name="3-2">活跃分析</MenuItem>
                    <MenuItem name="3-3">时段分析</MenuItem>
                </MenuGroup>
                <MenuGroup title="留存">
                    <MenuItem name="3-4">用户留存</MenuItem>
                    <MenuItem name="3-5">流失用户</MenuItem>
                </MenuGroup>
            </Submenu>
            <MenuItem name="4">
                <Icon type="ios-construct" />
                综合设置
            </MenuItem>

            <MenuItem name="4" to="/manage" class="my-manage">
                    <Icon type="md-bookmark" />我的学生
                    <div class="badge">
                        <Badge :count="manage.studentCount">
                        </Badge>
                    </div>
            </MenuItem>
        </Menu>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';
    export default {
        name: 'top-bar',
        data() {
            return {

            }
        },
        computed: {
            ...mapState(['manage'])
        },
        methods: {
            ...mapMutations(['addManageStudentCount'])
        },
        mounted() {
            let studentList = window.localStorage.getItem('manageStudentList');
            if (studentList) {
                this.addManageStudentCount({studentCount: JSON.parse(studentList).length})
            }
        }

    }
</script>
<style lang="less" scoped>
.my-manage{
    position: relative;
    .badge{
        position: absolute;
        top: -10px;
        right: -5px;
    }
}

</style>
