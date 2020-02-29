import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import Project from '@/components/project/Project'
import ProjectCount from '@/components/project/ProjectCount'
import ProjectDetail from '@/components/project/ProjectDetail'

import User from '@/components/user/User'
import UserTable from '@/components/user/UserTable'

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
            redirect: { name: 'project.count' },
            children: [{
                           path: '/project/count',
                           name: 'project.count',
                           component: ProjectCount

                       },
                       {
                           path: '/project/detail/:projectId',
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
                path: '/user/table',
                name: 'user.table',
                component: UserTable
            }]
        }
    ]
})
