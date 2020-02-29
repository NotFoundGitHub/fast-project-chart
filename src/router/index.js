import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import Project from '@/components/user/UserProject'
import ProjectCount from '@/components/user/UserProjectCount'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'layout',
            component: Layout
        }, {
            path: '/project',
            name: 'project',
            component: Project,
            redirect: { name: 'project.count' },
            children: [{
                path: '/project/count',
                name: 'project.count',
                component: ProjectCount

            }]
        }
    ]
})
