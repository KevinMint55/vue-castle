import ajax from '../ajax';

const prefix = '/projects';

// 3.1 创建项目
export const createProject = (args) => ajax.post(`${prefix}`, args);
// 3.2 删除项目
export const delProject = (args) => ajax.del(`${prefix}`, args);
// 3.3 项目重命名
export const renameProject = (args) => ajax.put(`${prefix}`, args);
