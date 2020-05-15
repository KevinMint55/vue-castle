import ajax from '../ajax';

const prefix = '/views';

// 5.1 创建视图
export const createView = (args) => ajax.post(`${prefix}`, args);
// 5.2 删除视图
export const delView = (args) => ajax.del(`${prefix}`, args);
// 5.3 视图重命名
export const renameView = (args) => ajax.put(`${prefix}`, args);
// 5.4 获取视图数据
export const getView = (args) => ajax.get(`${prefix}`, args);
// 5.5 更新视图数据
export const updateViewData = (args) => ajax.post(`${prefix}/data`, args);
