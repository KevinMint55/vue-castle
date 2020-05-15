import ajax from '../ajax';

const prefix = '/groups';

// 2.1 创建团队
export const createGroup = (args) => ajax.post(`${prefix}`, args);
// 2.2 删除团队
export const delGroup = (args) => ajax.del(`${prefix}`, args);
// 2.3 团队列表
export const getGroups = (args) => ajax.get(`${prefix}`, args);
// 2.4 团队重命名
export const renameGroup = (args) => ajax.put(`${prefix}`, args);
// 2.5 获取团队详情
export const groupDetails = (args) => ajax.get(`${prefix}/details`, args);
// 2.6 邀请加入团队
export const groupInvite = (args) => ajax.post(`${prefix}/invite`, args);
// 2.7 离开团队
export const leaveGroup = (args) => ajax.del(`${prefix}/leave`, args);
