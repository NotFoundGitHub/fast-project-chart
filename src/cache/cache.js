import axios from './axios.util';

const fastCache = {
    getProjectInfo: params => axios.get('/api/v1/live/fast/ide/project/get.json', {params})
}

export default fastCache;
