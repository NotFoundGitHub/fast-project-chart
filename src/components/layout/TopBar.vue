<template>
    <div>
        <Menu mode="horizontal" theme="primary" active-name="1">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-stats" />
                    统计分析
                </template>
                <MenuGroup title="趣玩作品统计">
                    <MenuItem name="1-1" to="/project/count/rate">作品数排行</MenuItem>
                    <MenuItem name="1-2" to="/project/count/sum">最近作品数</MenuItem>
                    <MenuItem name="1-3" to="/project/count/remix">最近改编数</MenuItem>
                </MenuGroup>
            </Submenu>
            <MenuItem name="2" to="/user">
                <Icon type="ios-people" />
                用户管理
            </MenuItem>
            <MenuItem name="3" to="/manage" class="my-manage">
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
