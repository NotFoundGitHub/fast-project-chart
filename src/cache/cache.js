import axios from './axios.util';

const fastCache = {
    getProjectInfo: params => axios.get('/api/v1/live/fast/ide/project/get.json', {params}),
    /**
     * fast编辑器获取作品信息
     * @param limit
     * @param startTime
     * @param endTime
     */
    getProjectUserRate: params => axios.get('/api/v1/live/fast/project/count', {params}),
    /**
     * 分页获取所有作品
     * @param pageIndex
     * @param pageSize
     */
    getAllFastProject: params => axios.get('/api/v1/live/fast/project/all/list', {params}),
    /**
     * 获取用户的趣玩作品信息
     * @param key 关键字
     * @param type 1 作品ID 2 改编作品 3 用户ID  4 手机号
     * @param key
     * @param type
     * @param startTime
     * @param endTime
     * @param pageIndex
     * @param pageSize
     **/
    getFastProjectListByMemberInfo: params => axios.get('/api/v1/live/fast/project/search/list', {params}),
    /**
     * 获取用户信息
     * @param memberId
     */
    getUserInfo: params => axios.get('/api/v1/live/fast/admin/user/info', {params}),
    /**
     * 获取用户信息
     * @param projectId
     * @param projectUrl
     */
    restoreProject: params => axios.get('/api/v1/live/fast/ide/project/admin/restore', {params}),
    /**
     * 获取每天的趣玩作品量
     * @param days 天数
     * @param parentId 改编作品ID
     **/
    getEveryDayProjectCount: params => axios.get('/api/v1/live/fast/project/everyday', {params})

}

export default fastCache;
