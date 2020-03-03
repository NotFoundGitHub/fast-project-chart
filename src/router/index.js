import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import Project from '@/components/project/Project'
import ProjectCountRate from '@/components/project/ProjectCountRate'
import ProjectCountSum from '@/components/project/ProjectCountSum'
import ProjectCountRemix from '@/components/project/ProjectCountRemix'

import ProjectDetail from '@/components/project/ProjectDetail'

import User from '@/components/user/User'
import UserTable from '@/components/user/UserTable'

import Manage from '@/components/manage/Manage'
import ManageList from '@/components/manage/ManageList'
import ManageProjectList from '@/components/manage/ManageProjectList'

import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect: { name: 'project' }
        }, {
            path: '/project',
            name: 'project',
            component: Project,
            redirect: { name: 'project.count.rate' },
            children: [{
                           path: 'count/rate',
                           name: 'project.count.rate',
                           component: ProjectCountRate
                       }, {
                           path: 'count/sum',
                           name: 'project.count.sum',
                           component: ProjectCountSum
                       }, {
                           path: 'count/remix',
                           name: 'project.count.remix',
                           component: ProjectCountRemix
                       },
                       {
                           path: 'detail/:projectId',
                           name: 'project.detail',
                           component: ProjectDetail
                       }
            ]
        }, {
            path: '/user',
            name: 'user',
            component: User,
            redirect: { name: 'user.table' },
            children: [{
                path: 'table',
                name: 'user.table',
                component: UserTable
            }]
        },
        {
            path: '/manage',
            name: 'manage',
            component: Manage,
            redirect: { name: 'manage.list' },
            children: [{
                path: 'list',
                name: 'manage.list',
                component: ManageList
            }, {
                path: 'project/list/:memberId',
                name: 'manage.project.list',
                component: ManageProjectList
            }]
        }, {
            path: '*',
            name: '404',
            component: NotFound
        }
    ]
})
