<template>
    <div class="user-manage">
        <div class="user-manage-edit">
            开启编辑 <i-switch v-model="isEdit" class="user-manage-edit-switch" />
            一键清空 <i-switch @on-change="deleteAll" class="user-manage-edit-switch" />
        </div>
        <div class="user-manage-list">
            <Card class="user-manage-list-card"  v-for="(item,index) in memberList" :key="'mange-user'+index">
                <div class="user-manage-list-card-div" @click="jumpManageProject(item.authorId)" >
                    <img class="user-manage-list-card-div-img" :src="item.smallFaceUrl">
                    <p class="user-manage-list-card-div-name">{{item.authorName}}</p>
                    <p class="user-manage-list-card-div-memberId">ID:{{item.authorId}}</p>
                </div>
                <div class="user-manage-list-card-del" v-if="isEdit" @click="delMemberByIndex(index)">
                    X
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'manage-list',
        computed: {
            ...mapState(['manage'])
        },
        data() {
            return {
                isEdit: false,
                memberList: []
            }
        },
        // 生命周期
        mounted() {
            // 从本地拿出选择的学生
            let studentListStr = window.localStorage.getItem('manageStudentList');
            this.memberList = JSON.parse(studentListStr) || [];
        },
        updated() {
            console.log('updated....')
        },
        methods: {
            ...mapMutations(['addManageStudentCount']),

            // 点评作品
            jumpManageProject(memberId) {
                this.$router.push({name: 'manage.project.list', params: { memberId }})
            },
            // 删除用户
            delMemberByIndex(index) {
                console.log('index', index)
                // 1.先从localStorage中取出数据
                let manageStudentList = window.localStorage.getItem('manageStudentList');
                if (manageStudentList) {
                    manageStudentList = JSON.parse(manageStudentList);
                } else {
                    manageStudentList = []
                }
                // 2.显示列表删除
                this.memberList.splice(index, 1);

                // 3.向列表中删除一条数据
                manageStudentList.splice(index, 1);
                // 4.存入本地
                window.localStorage.setItem('manageStudentList', JSON.stringify(manageStudentList));
                // 修改学生数量
                this.addManageStudentCount({
                    studentCount: this.manage.studentCount - 1
                })
            },
            deleteAll(state) {
                if (state === true) {
                    console.log('deleteAll');
                    localStorage.removeItem('manageStudentList');
                    this.memberList = [];
                    this.addManageStudentCount({
                        studentCount: 0
                    })
                }
            }

        }
    }
</script>
<style lang="less" scoped>
@del-btn: 24px;
@del-btn-radis: -@del-btn/2;
.user-manage{
    &-edit{
        text-align: left;
        margin: 20px;
        &-switch{
            margin-left: 5px;
        }
    }
    &-list{
        margin:20px auto 0 auto;
        display: flex;
        flex-wrap: wrap;
        &-search{
            display: flex;
            &-input{
                margin-left: 10px;
            }
            &-btn{
                margin-left: 10px;
            }
        }
        &-card{
            width: 200px;
            margin: 10px;
            position: relative;
            &-div{
                text-align:center;
                &-img{
                    width: 80px;
                }
                &-content{

                }
            }
            &-del{
                position: absolute;
                right: @del-btn-radis;
                top: @del-btn-radis;
                width: @del-btn;
                height: @del-btn;
                background: #f23;
                color: #fff;
                text-align: center;
                line-height: @del-btn;
                border-radius: @del-btn;
                cursor: pointer;
            }
        }

    }
}

</style>
