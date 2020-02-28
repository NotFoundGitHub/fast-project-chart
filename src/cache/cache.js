import axios from './axios.util';

const fastCache = {
    getProjectInfo: params => axios.get('/api/v1/live/fast/ide/project/get.json', {params}),
    getProjectUserRate: params => axios.get('/api/v1/live/fast/project/count', {params})
}

export default fastCache;
