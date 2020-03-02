import axios from './axios.util';

const fastCache = {
    getProjectInfo: params => axios.get('/api/v1/live/fast/ide/project/get.json', {params}),
    getProjectUserRate: params => axios.get('/api/v1/live/fast/project/count', {params}),
    getAllFastProject: params => axios.get('/api/v1/live/fast/project/all/list', {params}),
    getFastProjectListByMemberInfo: params => axios.get('/api/v1/live/fast/project/search/list', {params}),
    getUserInfo: params => axios.get('/api/v1/live/fast/admin/user/info', {params}),
    restoreProject: params => axios.get('/api/v1/live/fast/ide/project/admin/restore', {params})
}

export default fastCache;
